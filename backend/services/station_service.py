import os

import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("TANKERKOENIG_API_KEY")

TANKERKOENIG_URL = (
    "https://creativecommons.tankerkoenig.de/json/list.php"
)


def get_stations(
    lat: float,
    lng: float,
    fuel: str,
    radius: int
):
    params = {
        "lat": lat,
        "lng": lng,
        "rad": radius,
        "sort": "dist",
        "type": fuel,
        "apikey": API_KEY
    }

    try:
        response = requests.get(
            TANKERKOENIG_URL,
            params=params,
            timeout=10
        )

        response.raise_for_status()

    except requests.exceptions.Timeout:
        raise RuntimeError(
            "Tankerkönig API antwortet nicht."
        )

    except requests.exceptions.RequestException:
        raise RuntimeError(
            "Tankerkönig API ist momentan nicht erreichbar."
        )

    data = response.json()

    if not data.get("ok"):
        return []

    stations = []

    for station in data.get("stations", []):

        price = station.get("price")

        if price is None:
            continue


        stations.append({
            "id": station.get("id"),
            "name": station.get("name"),
            "brand": station.get("brand"),
            "price": station.get("price"),
            "distance": station.get("dist"),
            "lat": station.get("lat"),
            "lng": station.get("lng"),
            "isOpen": station.get("isOpen")
        })

    return stations