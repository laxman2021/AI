from fastapi import FastAPI
from app.db import Base, engine
from app.routers import upload, datasets, ai

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Institutional Data AI")

app = FastAPI()

app.include_router(upload.router)
app.include_router(datasets.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {
        "message": "Institutional Data Explorer API"
    }
    