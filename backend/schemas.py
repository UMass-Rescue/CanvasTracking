from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


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
    push_token: str


class CurrentLocations(BaseModel):
    entries: List[GPSEntry]
