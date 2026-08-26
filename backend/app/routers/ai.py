from fastapi import APIRouter
from app.services.ai_service import train_model, predict
import os

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)

# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# BASE_DIR = os.path.dirname(
#     os.path.dirname(
#         os.path.dirname(os.path.abspath(__file__))
#     )
# )
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(os.path.abspath(__file__))
    )
)
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")


@router.post("/train/{dataset_id}")
def train(dataset_id: int, target: str):

    csv_path = os.path.join(
        UPLOAD_DIR,
        f"{dataset_id}.csv"
    )

    print("UPLOAD_DIR:", UPLOAD_DIR)
    print("CSV PATH:", csv_path)
    print("FILE EXISTS:", os.path.exists(csv_path))

    if not os.path.exists(csv_path):
        return {
            "error": "Dataset not found"
        }

    return train_model(csv_path, target)


@router.post("/predict")
def make_prediction(payload: dict):

    return predict(payload)
