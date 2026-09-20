import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.controllers.station_controller import router as station_router
from backend.controllers.geocode_controller import router as geocode_router

load_dotenv()

api_key = os.getenv("TANKERKOENIG_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:63342",
        "http://127.0.0.1:63342"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(station_router)
app.include_router(geocode_router)


@app.get("/")
def root():
    return {"status": "Fuel Price Finder läuft"}