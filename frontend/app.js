import {
    getCoordinates,
    getStations
} from "./services/api.js";

console.log("app.js läuft");


let userLatitude = null;
let userLongitude = null;

const savedPostalCode = localStorage.getItem("postalCode");

if (savedPostalCode) {
    document.getElementById("postalCode").value = savedPostalCode;
}


const map = L.map("map").setView([48.265, 10.984], 13);

const stationLayer = L.layerGroup().addTo(map);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


async function loadStations() {
    console.log("Suchbutton wurde geklickt");

    try {
        const fuel = document.getElementById("fuel").value;
        const radius = document.getElementById("radius").value;
        const sort = document.getElementById("sort").value;
        const postalCode = document.getElementById("postalCode").value.trim();

        if (postalCode) {
            localStorage.setItem("postalCode", postalCode);
        }

        let latitude;
        let longitude;


        // Variante 1: PLZ wurde eingegeben
        if (postalCode) {
            const coordinates = await getCoordinates(postalCode);

            console.log("Koordinaten:", coordinates);

            latitude = coordinates.lat;
            longitude = coordinates.lng;
        }

        // Variante 2: Browser-Standort wurde verwendet
        else if (
            userLatitude !== null &&
            userLongitude !== null
        ) {
            latitude = userLatitude;
            longitude = userLongitude;
        }

        // Kein Standort vorhanden
        else {
            alert("Bitte PLZ eingeben oder eigenen Standort verwenden.");
            return;
        }


        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);


        // Tankstellen vom Backend laden
        const data = await getStations(
            latitude,
            longitude,
            fuel,
            radius
        );

        console.log("Stations-Daten:", data);

        const stations = data.stations;

        if (sort === "price") {
            stations.sort((a, b) => a.price - b.price);
        } else if (sort === "distance") {
            stations.sort((a, b) => a.distance - b.distance);
        }


        // Container für Tankstellenliste
        const stationsContainer =
            document.getElementById("stations");

        stationsContainer.innerHTML = "";


        // Keine Tankstellen gefunden
        if (!stations || stations.length === 0) {
            stationsContainer.innerHTML =
                "<p>Keine Tankstellen gefunden.</p>";
            return;
        }


        // Günstigste Tankstelle bestimmen
        const cheapestStation = stations.reduce(
            (cheapest, station) => {
                return station.price < cheapest.price
                    ? station
                    : cheapest;
            }
        );

        stationLayer.clearLayers();

        // Tankstellen anzeigen
        stations.forEach(station => {

            const stationElement =
                document.createElement("div");
            stationElement.classList.add("station-card");

            const isCheapest =
                station.id === cheapestStation.id;

            if (isCheapest) {
                stationElement.classList.add("cheapest");
            }


            // Ausgabe in der Liste
            stationElement.innerHTML = `
            <h3>
                ${station.name}
                ${isCheapest ? "★ Günstigste" : ""}
            </h3>

            <p>
                ${station.brand || ""}
            </p>

            <p class="station-price">
               ${station.price.toFixed(3).replace(".", ",")} €/l
            </p>

            <p>
                Entfernung: ${station.distance} km
            </p>

            <p class="${station.isOpen ? "status-open" : "status-closed"}">
                ${station.isOpen ? "Geöffnet" : "Geschlossen"}
            </p>
        `;

            stationsContainer.appendChild(
                stationElement
            );


            // Marker auf der Karte
            let marker;

            if (isCheapest) {
                marker = L.circleMarker(
                    [
                        station.lat,
                        station.lng
                    ],
                    {
                        radius: 12,
                        color: "green",
                        fillColor: "green",
                        fillOpacity: 0.8
                    }
                ).addTo(stationLayer);
            } else {
                marker = L.marker(
                    [
                        station.lat,
                        station.lng
                    ]
                ).addTo(stationLayer);
            }


            // Popup für Marker
            marker.bindPopup(`
                <strong>${station.name}</strong>
                <br>

                ${
                isCheapest
                    ? "<strong>★ Günstigste Tankstelle</strong><br>"
                    : ""
            }

                ${station.price.toFixed(3).replace(".", ",")} €/l
                <br>

                ${station.distance} km
                <br>

                ${
                station.isOpen
                    ? "Geöffnet"
                    : "Geschlossen"
            }
            `);

            // Klick auf Tankstellenkarte
            stationElement.addEventListener("click", () => {
                map.setView(
                    [station.lat, station.lng],
                    16
                );

                marker.openPopup();
            });

            // Klick auf Marker
            marker.on("click", () => {

                document
                    .querySelectorAll(".station-card")
                    .forEach(card => {
                        card.classList.remove("selected");
                    });

                stationElement.classList.add("selected");

                stationElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            });

        });


        // Karte auf Suchposition zentrieren
        map.setView(
            [latitude, longitude],
            13
        );

    } catch (error) {
        console.error(
            "Fehler bei der Suche:",
            error
        );

        alert(error.message);
    }
}


// Browser-Standort bestimmen
document
    .getElementById("locationButton")
    .addEventListener("click", () => {

        const status =
            document.getElementById(
                "locationStatus"
            );

        if (!navigator.geolocation) {
            status.textContent =
                "Standortbestimmung wird von diesem Browser nicht unterstützt.";
            return;
        }

        status.textContent =
            "Standort wird bestimmt...";


        navigator.geolocation.getCurrentPosition(
            position => {

                userLatitude =
                    position.coords.latitude;

                userLongitude =
                    position.coords.longitude;

                status.textContent =
                    "Standort erfolgreich bestimmt.";

                console.log(
                    "Browser Latitude:",
                    userLatitude
                );

                console.log(
                    "Browser Longitude:",
                    userLongitude
                );
            },

            error => {
                console.error(
                    "Standortfehler:",
                    error
                );

                status.textContent =
                    "Standort konnte nicht bestimmt werden.";
            }
        );
    });


// Suchbutton
document
    .getElementById("searchButton")
    .addEventListener(
        "click",
        loadStations
    );