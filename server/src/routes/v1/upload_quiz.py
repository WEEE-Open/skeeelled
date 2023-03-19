from fastapi import APIRouter, HTTPException, UploadFile
from db import db, DbName
from utils import responses
import defusedxml.ElementTree as ET
from xml.etree.ElementTree import ElementTree, Element
import xmltodict
from pprint import pprint
from typing import List
from uuid import uuid4
from base64 import b64decode
import magic
import mimetypes

VALID_TYPES = "category|multichoice|truefalse|shortanswer|matching|cloze|essay|numerical|description".split("|")
VALID_MIME_TYPES = ""

router = APIRouter()


def get_text(elem: Element) -> str:
    if text_elem := elem.find("text"):
        return text_elem.text
    return elem.text


def save_file(file: Element, parent: Element):
    _id = uuid4()
    buffer = b64decode(file.text)
    file.text = None
    mime_type = magic.from_buffer(buffer, mime=True)
    ext = mimetypes.guess_extension(mime_type)
    print(mime_type)
    print()
    with open(f"../static/{_id}{ext}", "wb") as fp:
        fp.write(buffer)


def create_question(elem: Element, categories: List[str]):
    pass


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

    for event, elem in ET.iterparse(file.file, events=("start", "end")):
        if event == "start":
            if not (stack or elem.tag == "quiz"):
                raise HTTPException(status_code=422, detail="Not a valid MoodleXML file (root element is not quiz)")
            stack.append(elem)
        if event == "end":
            """
            if elem.tag == "question":
                if (_type := elem.get("type")) not in VALID_TYPES:
                    raise HTTPException(status_code=422,
                                        detail="Not a valid MoodleXML file (question has a empty or wrong type)")
                if _type == "category":
                    categories = get_text(elem.find("category")).split("/")[1:]
                    continue
                create_question(elem, categories)
                elem.clear()
            """
            stack.pop()
            if elem.tag == "file":
                print("file found")
                parent = stack[-1]
                save_file(elem, parent)

    print(elem.tag)
    print("stack = ", stack)
    tree = ElementTree(elem)
    # tree.write("uploaded_xml.xml")

    """
    quiz = xmltodict.parse(file.file)

    pprint(quiz)
    """
