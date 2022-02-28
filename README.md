# CanvasTracking

Goals:

[x] Build a cross platform mobile application that relays the latest GPS position of the app
user to a backend server
[x] The app should be able to relay position continiously (unsure if it will be able to
run in the background)
    - may have to use sticky notifications
[x] The backend should store the position data from all the investigators canvassing,
and it should have an endpoint for returning the latest position of all the investigators (possibly a websocket)
[x] The mobile app should have a map to render the positions of the investigators


Further Tasks

- Have the backend send a push notification to investigators who are close to each other
- Be able to see the paths of of canvassing investigators to prevent investigator overlap
- Allow investigators to enter their projected path so they can get directions and let
other investigators know of their plans


Tools:
- FastAPI
- Postgres & PostGIS
- React Native & Expo
- React Native Maps