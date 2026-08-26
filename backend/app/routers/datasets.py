from fastapi import APIRouter, UploadFile, File, Depends
import pandas as pd
import os
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models import Dataset, Record

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...), db: Session = Depends(get_db)):
    path = f"data/{file.filename}"
    
    with open(path, "wb") as f:
        f.write(await file.read())

    df = pd.read_csv(path)

    dataset = Dataset(name=file.filename, file_path=path)
    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    for _, row in df.iterrows():
        record = Record(dataset_id=dataset.id, data=row.to_dict())
        db.add(record)

    db.commit()

    return {"dataset_id": dataset.id}