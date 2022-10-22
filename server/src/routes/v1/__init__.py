from fastapi import APIRouter
from .lists import router as lists_router

router = APIRouter()


@router.get("/")
def index():
    return {"msg": "You have successfully reached API v1"}


router.include_router(lists_router)
