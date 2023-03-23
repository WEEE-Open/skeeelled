from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router as main_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*localhost:.*",
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(main_router)
