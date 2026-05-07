import os

# DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost:5432/instdata")
DATABASE_URL = "sqlite:///./test.db"
SECRET_KEY = "supersecret"
ALGORITHM = "HS256"
