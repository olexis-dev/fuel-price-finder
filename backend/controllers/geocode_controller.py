from fastapi import APIRouter, HTTPException

from backend.services.geocode_service import get_coordinates

router = APIRouter()


@router.get("/geocode")
def geocode(postal_code: str):

    if not postal_code.isdigit() or len(postal_code) != 5:
        raise HTTPException(
            status_code=400,
            detail="Die PLZ muss aus genau 5 Ziffern bestehen."
        )

    coordinates = get_coordinates(postal_code)

    if coordinates is None:
        raise HTTPException(
            status_code=404,
            detail="PLZ wurde nicht gefunden."
        )

    return {
        "postal_code": postal_code,
        "lat": coordinates["lat"],
        "lng": coordinates["lng"]
    }