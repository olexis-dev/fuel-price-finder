import requests


def get_coordinates(postal_code: str):
    url = "https://nominatim.openstreetmap.org/search"

    params = {
        "postalcode": postal_code,
        "country": "Germany",
        "countrycodes": "de",
        "format": "json",
        "limit": 1
    }

    headers = {
        "User-Agent": "FuelPriceFinder/1.0"
    }

    response = requests.get(
        url,
        params=params,
        headers=headers,
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    if not data:
        return None

    return {
        "lat": float(data[0]["lat"]),
        "lng": float(data[0]["lon"])
    }