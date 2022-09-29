from enum import Enum


class DbName(Enum):
	COURSE = "courses"
	USER = "users"
	QUESTION = "questions"
	EXAM_SIM = "ExamSimulations"
	QUIZ = "quizzes"
	ANSWER = "answers"
