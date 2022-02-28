from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

NET_DB_USER = os.getenv("NET_DB_USER", "postgres")
NET_DB_PASS = os.getenv("NET_DE_PASS", "")
NET_DB_HOST = os.getenv("NET_DB_HOST", "localhost")
NET_DB_NAME = os.getenv("NET_DB_NAME", "canvastracking")

# SQLALCHEMY_DATABASE_URL = "sqlite:///./gps.db"
SQLALCHEMY_DATABASE_URL = (
    f"postgresql+psycopg2://{NET_DB_USER}:{NET_DB_PASS}@{NET_DB_HOST}/{NET_DB_NAME}"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
