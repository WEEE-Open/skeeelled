from fastapi import APIRouter, HTTPException, UploadFile
from db import db, DbName
from utils import responses
import defusedxml.ElementTree as ET
from xml.etree.ElementTree import Element
import xmltodict
from typing import List, Dict, BinaryIO
from uuid import uuid4
from base64 import b64decode
import magic
import mimetypes
from bson.objectid import ObjectId
import os
from urllib.parse import urljoin
import re
from pydantic import ValidationError
import models.db
import models.response

BASE_URL = "http://localhost/"
VALID_QUESTION_TYPES = "category|multichoice|truefalse|shortanswer|matching|cloze|essay|numerical|description".split(
    "|")
SUPPORTED_QUESTION_TYPES = {"category", "multichoice", "truefalse", "shortanswer", "essay", "numerical"}
# Unsupported question types: "matching", "cloze", "description"
VALID_MIME_TYPES = [r"^image/.+", r"^audio/.+", r"^video/.+"]
MEDIA_ROOT = "/server/media"
MEDIA_URL = urljoin(BASE_URL, "/media/")
FILE_SIZE_LIMIT = int(8e6)  # 8 MB
type_model_map: Dict[str, models.db.question.MoodleQuestion.__class__] = {
    "multichoice": models.db.question.MultichoiceQuestion,
    "truefalse": models.db.question.TruefalseQuestion,
    "shortanswer": models.db.question.ShortanswerQuestion,
    "essay": models.db.question.EssayQuestion,
    "numerical": models.db.question.NumericalQuestion
}

router = APIRouter()


def get_text(elem: Element) -> str:
    text = elem.findtext("text")
    if text:
        return text
    return elem.text


def save_file(file: Element, path: str):
    _id = uuid4()
    buffer = b64decode(file.text)
    file.text = None
    if len(buffer) > FILE_SIZE_LIMIT:
        raise HTTPException(422, f"Cannot upload files over {FILE_SIZE_LIMIT / 1e6} MB")
    mime_type = magic.from_buffer(buffer, mime=True)
    if not any([re.match(mt, mime_type) for mt in VALID_MIME_TYPES]):
        raise HTTPException(422, f"Cannot upload file with mime type {mime_type}")
    ext = mimetypes.guess_extension(mime_type)
    filename = f"{_id}{ext}"
    dirpath = os.path.join(MEDIA_ROOT, path)
    filepath = os.path.join(dirpath, filename)
    os.makedirs(dirpath)
    with open(filepath, "wb") as fp:
        fp.write(buffer)
    url = urljoin(urljoin(MEDIA_URL, path), filename)
    file.attrib.pop("encoding")
    file.set("url", url)
    return url


def create_question(elem: Element, _id: ObjectId, owner: str, course_id: str, quiz_id: ObjectId, is_exam: bool,
                    categories: List[str]) -> models.db.question.MoodleQuestion:
    question_xml = ET.tostring(elem, encoding="UTF-8")
    question = xmltodict.parse(question_xml)["question"]
    _id = _id if _id else ObjectId()
    if isinstance(question["name"], dict):
        question["name"] = question["name"]["text"]
    try:
        model = type_model_map[question["@type"]]
        return model(
            _id=_id,
            owner=owner,
            course_id=course_id,
            quiz_id=quiz_id,
            categories=categories,
            is_exam=is_exam,
            **question
        )
    except KeyError:
        raise HTTPException(status_code=501,
                            detail=f"Only following question types are supported: {SUPPORTED_QUESTION_TYPES}")
    except ValidationError:
        raise HTTPException(status_code=422, detail="Error while parsing the questions")


def parse_xml(file: BinaryIO, user_id: str, course_id: str, quiz_id: ObjectId, is_exam: bool) -> List[
    models.db.MoodleQuestion]:
    categories = []
    stack = []
    question_ids = {}
    questions = []

    # Remove the xml tag
    xml_tag = file.readline()
    if xml_tag != b'<?xml version="1.0" encoding="UTF-8"?>\r\n':
        raise HTTPException(status_code=422, detail="Not a valid XML file")

    for event, elem in ET.iterparse(file, events=("start", "end")):
        if event == "start":
            if not (stack or elem.tag == "quiz"):
                raise HTTPException(status_code=422, detail="Not a valid MoodleXML file (root element is not quiz)")
            stack.append(elem)
        if event == "end":
            stack.pop()
            if elem.tag == "question":
                if (_type := elem.get("type")) not in VALID_QUESTION_TYPES:
                    raise HTTPException(status_code=422,
                                        detail="Not a valid MoodleXML file (question has a empty or wrong type)")
                elif _type not in SUPPORTED_QUESTION_TYPES:
                    raise HTTPException(status_code=501,
                                        detail=f"Only following question types are supported: {SUPPORTED_QUESTION_TYPES}")
                if _type == "category":
                    categories = get_text(elem.find("category")).split("/")[1:]
                    continue
                questions.append(
                    create_question(elem, question_ids.get(elem), user_id, course_id, quiz_id, is_exam, categories)
                )
                elem.clear()
            if elem.tag == "file":
                question_elem = stack[1]
                if question_elem.tag != "question":
                    raise HTTPException(status_code=422,
                                        detail="Not a valid MoodleXML file (has a first level element that is not a question)")
                if question_elem not in question_ids:
                    question_ids[question_elem] = ObjectId()
                question_id = question_ids[question_elem]
                path = os.path.join(course_id, str(quiz_id), str(question_id)) + "/"
                save_file(elem, path)

    return questions


@router.post("/uploadQuestionsFile", status_code=201, response_model=models.response.Quiz,
             responses=responses(403, 404, 422, 501))
async def upload_questions_file(file: UploadFile, user_id: str, course_id: str, is_exam: bool = False):
    user = await db[DbName.USER.value].find_one({"_id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if not user["is_professor"]:
        raise HTTPException(status_code=403, detail="Only professors can upload quiz files")
    if course_id not in user["related_courses"]:
        raise HTTPException(status_code=403, detail="Professor is not related to this course")
    course = await db[DbName.COURSE.value].find_one({"_id": course_id})
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")

    quiz_id = ObjectId()
    questions = parse_xml(file.file, user_id, course_id, quiz_id, is_exam)

    quiz = models.db.Quiz(
        _id=quiz_id,
        uploaded_by=user_id,
        course_id=course_id,
        is_exam=is_exam,
        filename=file.filename
    )

    quiz = await db[DbName.QUIZ.value].insert_one(quiz.dict(by_alias=True))
    questions = await db[DbName.QUESTION.value].insert_many([q.dict(by_alias=True) for q in questions])

    return {"quiz_id": quiz.inserted_id, "questions": questions.inserted_ids}
