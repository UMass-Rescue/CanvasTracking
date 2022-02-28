import models
import schemas


def create_user(db, user):
    user = db.query(models.User).filter(models.User.name == user.name).first()
    if user is not None:
        return False
    db.add(models.User(name=user.name))
    db.commit()
    return True


def create_location(db, location):
    user = db.query(models.User).filter(models.User.name == location.name).first()
    if user is None:
        return False
    db.add(
        models.Location(
            latitude=location.latitude,
            longitude=location.longitude,
            user_id=user.id,
        )
    )
    db.commit()
    return True


def get_current_locations(db):
    users = db.query(models.User).filter(models.User.active).all()
    latest_locations = []
    for user in users:
        latest_location = (
            db.query(models.Location)
            .filter(models.Location.user_id == user.id)
            .order_by(models.Location.created_at.desc())
            .first()
        )
        if latest_location is not None:
            latest_locations.append(
                schemas.GPSEntry(
                    latitude=latest_location.latitude,
                    longitude=latest_location.longitude,
                    name=user.name,
                    time=latest_location.created_at,
                )
            )

    return latest_locations
