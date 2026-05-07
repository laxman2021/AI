from fastapi import APIRouter
from app.services.ai_service import train_model, predict
import os

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/train/{dataset_id}")
def train(dataset_id: int, target: str):

    csv_path = f"data/{dataset_id}.csv"

    if not os.path.exists(csv_path):
        return {"error": "Dataset not found"}

    result = train_model(csv_path, target)

    return result


@router.post("/predict")
def make_prediction(payload: dict):

    result = predict(payload)

    return result