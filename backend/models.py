import datetime

from database import Base
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Float
from sqlalchemy.sql import func


class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=func.now())
    name = Column(String(50), unique=True, index=True)


class Location(Base):
    __tablename__ = "location"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=func.now())
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    user_id = Column(Integer, nullable=False)
