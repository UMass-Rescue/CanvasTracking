from pydantic import BaseModel

from typing import List, Optional
from datetime import datetime


class StatusMessage(BaseModel):
    status: str
    message: str


class GPSEntry(BaseModel):
    latitude: float
    longitude: float
    name: str
    time: Optional[datetime]


class User(BaseModel):
    name: str


class CurrentLocations(BaseModel):
    entries: List[GPSEntry]
