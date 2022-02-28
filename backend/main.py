from fastapi import Depends, FastAPI, WebSocket

import crud
import models
import schemas
from database import SessionLocal, engine
import asyncio
import push_handler

models.Base.metadata.create_all(bind=engine)


app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/register/", response_model=schemas.StatusMessage)
def insert_user(body: schemas.User, session=Depends(get_db)):
    if crud.create_user(session, body):
        return schemas.StatusMessage(status="success", message="user created")
    return schemas.StatusMessage(status="failure", message="user already exists")


@app.post("/location/", response_model=schemas.StatusMessage)
def insert_location(body: schemas.GPSEntry, session=Depends(get_db)):
    if crud.create_location(session, body):
        return schemas.StatusMessage(status="success", message="location created")
    return schemas.StatusMessage(status="failure", message="user does not exist")


@app.websocket("/investigator_locations/")
async def get_current_investigator_locations(
    websocket: WebSocket, session=Depends(get_db)
):
    await websocket.accept()
    while True:
        await asyncio.sleep(1)
        current_locations = crud.get_current_locations(session)
        await websocket.send_text(
            schemas.CurrentLocations(entries=current_locations).json()
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
