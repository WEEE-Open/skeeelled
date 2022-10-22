from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def index():
    return {"msg": "You have successfully reached API v1"}
