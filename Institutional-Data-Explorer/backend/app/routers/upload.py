from fastapi import APIRouter, UploadFile, File
import os
import shutil

router = APIRouter()

# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(os.path.abspath(__file__))
    )
)

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
def upload_dataset(file: UploadFile = File(...)):

    dataset_id = len(os.listdir(UPLOAD_DIR)) + 1

    file_path = os.path.join(
        UPLOAD_DIR,
        f"{dataset_id}.csv"
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "dataset_id": dataset_id
    }