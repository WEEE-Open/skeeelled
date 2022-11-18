from enum import Enum
import motor.motor_asyncio


class DbName(Enum):
	COURSE = "courses"
	USER = "users"
	QUESTION = 'questions'
	COMMENT = 'comments'
	EXAM_SIM = 'simulations'


db = motor.motor_asyncio.AsyncIOMotorClient("mongodb://root:example@mongodb:27017/").test_db
