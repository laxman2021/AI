from sqlalchemy import Column, Integer, String, ForeignKey, JSON, DateTime
from datetime import datetime
from app.db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(String, default="viewer")

class Dataset(Base):
    __tablename__ = "datasets"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    file_path = Column(String)
    uploaded_by = Column(Integer, ForeignKey("users.id"))

class Record(Base):
    __tablename__ = "records"
    id = Column(Integer, primary_key=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"))
    data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class ModelMeta(Base):
    __tablename__ = "models"
    id = Column(Integer, primary_key=True)
    dataset_id = Column(Integer)
    target_column = Column(String)
    accuracy = Column(String)
    model_path = Column(String)