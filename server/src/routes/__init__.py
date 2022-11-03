from fastapi import APIRouter
from .v1 import router as v1router

router = APIRouter()

router.include_router(v1router, prefix="/v1")
