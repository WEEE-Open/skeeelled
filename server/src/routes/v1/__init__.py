from fastapi import APIRouter
from .lists import router as lists_router
from .single_objects import router as objects_router

router = APIRouter()


@router.get("/")
def index():
    return {"msg": "You have successfully reached API v1"}


router.include_router(lists_router, tags=["list"])
router.include_router(objects_router, tags=["single object"])
