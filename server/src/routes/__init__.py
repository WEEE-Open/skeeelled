from fastapi import APIRouter
from .v1 import router as v1router
from .saml import router as samlrouter

router = APIRouter()

router.include_router(v1router, prefix="/v1")
router.include_router(samlrouter, prefix="/saml", tags=["auth"])
