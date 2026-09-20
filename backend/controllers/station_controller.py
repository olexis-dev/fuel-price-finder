from fastapi import APIRouter, HTTPException

from backend.services.station_service import get_stations

router = APIRouter()


@router.get("/stations")
def stations(
        lat: float,
        lng: float,
        fuel: str = "e10",
        radius: int = 5
):
    try:
        station_list = get_stations(
            lat,
            lng,
            fuel,
            radius
        )

    except RuntimeError as error:
        raise HTTPException(
            status_code=503,
            detail=str(error)
        )

    return {
        "lat": lat,
        "lng": lng,
        "fuel": fuel,
        "radius": radius,
        "stations": station_list

    }