from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models import Record
from app.services.ai_service import train_model, predict
import pandas as pd

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/train/{dataset_id}")
def train(dataset_id: int, target: str, db: Session = Depends(get_db)):
    records = db.query(Record).filter(Record.dataset_id == dataset_id).all()
    data = [r.data for r in records]
    df = pd.DataFrame(data)

    acc = train_model(df, target)

    return {"accuracy": acc}

@router.post("/predict")
def make_prediction(payload: dict):
    result = predict(payload)
    return {"prediction": result}