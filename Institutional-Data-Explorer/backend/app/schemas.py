from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str

class DatasetCreate(BaseModel):
    name: str

class PredictionRequest(BaseModel):
    data: dict