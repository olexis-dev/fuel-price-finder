# Fuel Price Finder

Fuel Price Finder is a web application for finding current fuel prices at nearby gas stations in Germany.

Users can search by German postal code or optionally use their browser location. The application retrieves current station and fuel price data from the Tankerkönig API and displays the results both as a list and on an interactive map.

## Features

- Search gas stations by German postal code
- Optional browser geolocation
- Current fuel prices from the Tankerkönig API
- Support for E10, E5 and Diesel
- Search radius: 2, 5, 10 or 20 km
- Sort results by price or distance
- Highlight the cheapest station
- Display station distance and opening status
- Interactive map with station markers
- Responsive layout for desktop and mobile devices
- Last used postal code stored locally in the browser
- Backend error handling for unavailable external services

## Tech Stack

### Backend

- Python
- FastAPI
- Requests
- python-dotenv

### Frontend

- HTML
- CSS
- JavaScript
- Leaflet
- OpenStreetMap

### External Services

- Tankerkönig API for fuel prices and gas station data
- OpenStreetMap Nominatim for postal code geocoding

## Project Structure

```text
fuel-price-finder/
├── backend/
│   ├── controllers/
│   │   ├── geocode_controller.py
│   │   └── station_controller.py
│   ├── services/
│   │   ├── geocode_service.py
│   │   └── station_service.py
│   └── main.py
│
├── frontend/
│   ├── services/
│   │   └── api.js
│   ├── app.js
│   └── index.html
│
├── .env.example
├── .gitignore
├── README.md
└── requirements.txt
```

## Installation

Clone the repository:

```bash
git clone https://github.com/olexis-dev/fuel-price-finder.git
cd fuel-price-finder
```

Create and activate a virtual environment:

```bash
python -m venv .venv
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

## Configuration

Create a `.env` file in the project root.

You can use `.env.example` as a template:

```env
TANKERKOENIG_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your own Tankerkönig API key.

The `.env` file is excluded from Git and must not be committed.

## Start the Backend

From the project root run:

```bash
uvicorn backend.main:app --reload
```

The API will then be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

## Frontend

Open `frontend/index.html` using a local development server.

The frontend communicates with the FastAPI backend running on port `8000`.

## API Endpoints

### Application status

```text
GET /
```

### Geocode a German postal code

```text
GET /geocode?postal_code=86415
```

### Find gas stations

```text
GET /stations?lat=48.2665921&lng=11.0028788&fuel=e10&radius=5
```

## Security

The Tankerkönig API key is stored in a local `.env` file and is not exposed in the frontend or committed to the repository.

## Project Status

The core functionality is implemented and working locally.

Planned next steps include mobile testing, UI improvements and deployment of the application.