from fastapi import APIRouter, HTTPException, UploadFile
from db import db, DbName
from utils import responses
import defusedxml.ElementTree as ET
from xml.etree.ElementTree import Element
import xmltodict
from pprint import pprint
from typing import List
from uuid import uuid4
from base64 import b64decode
import magic
import mimetypes
from bson.objectid import ObjectId
import os
from urllib.parse import urljoin
import re


BASE_URL = "http://localhost/"
VALID_TYPES = "category|multichoice|truefalse|shortanswer|matching|cloze|essay|numerical|description".split("|")
VALID_MIME_TYPES = [r"^image/.+", r"^audio/.+", r"^video/.+"]
MEDIA_ROOT = "/server/media"
MEDIA_URL = urljoin(BASE_URL, "/media/")

router = APIRouter()


def get_text(elem: Element) -> str:
    if text_elem := elem.find("text"):
        return text_elem.text
    return elem.text


def save_file(file: Element, parent: Element, path: str):
    _id = uuid4()
    buffer = b64decode(file.text)
    file.text = None
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


def create_question(elem: Element, categories: List[str]):
    question_xml = ET.tostring(elem, encoding="UTF-8")
    question_json = xmltodict.parse(question_xml)
    pprint(question_json)



@router.post("/uploadQuestionsFile", responses=responses(403, 404, 422))
async def upload_questions_file(file: UploadFile, user_id: str = "", course_id: str = ""):
    """
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

    print(file.filename, file.content_type)
    """

    # Remove the xml tag
    xml_tag = file.file.readline()
    if xml_tag != b'<?xml version="1.0" encoding="UTF-8"?>\n':
        print(xml_tag)
        raise HTTPException(status_code=422, detail="Not a valid XML file")

    categories = []
    stack = []
    quiz_id = ObjectId()
    question_ids = {}

    for event, elem in ET.iterparse(file.file, events=("start", "end")):
        if event == "start":
            if not (stack or elem.tag == "quiz"):
                raise HTTPException(status_code=422, detail="Not a valid MoodleXML file (root element is not quiz)")
            stack.append(elem)
        if event == "end":
            stack.pop()
            if elem.tag == "question":
                if (_type := elem.get("type")) not in VALID_TYPES:
                    raise HTTPException(status_code=422,
                                        detail="Not a valid MoodleXML file (question has a empty or wrong type)")
                if _type == "category":
                    categories = get_text(elem.find("category")).split("/")[1:]
                    continue
                create_question(elem, categories)
                elem.clear()
            if elem.tag == "file":
                print("file found")
                parent = stack[-1]
                question_elem = stack[1]
                if question_elem.tag != "question":
                    raise HTTPException(status_code=422,
                                        detail="Not a valid MoodleXML file (has a first level root that is not a question)")
                if question_elem not in question_ids:
                    question_ids[question_elem] = ObjectId()
                question_id = question_ids[question_elem]
                path = os.path.join(course_id, str(quiz_id), str(question_id)) + "/"
                print(save_file(elem, parent, path))

