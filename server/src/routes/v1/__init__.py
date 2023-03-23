from fastapi import APIRouter
from .lists import router as lists_router
from .single_objects import router as objects_router
from .search import router as search_router
from .simulation import router as simulation_router
from .upload_quiz import router as upload_router

router = APIRouter()


@router.get("/")
def index():
    return {"msg": "You have successfully reached API v1"}


router.include_router(lists_router, tags=["list"])
router.include_router(objects_router, tags=["single object"])
router.include_router(search_router, tags=["search"])
router.include_router(simulation_router, tags=["simulation"])
router.include_router(upload_router)
