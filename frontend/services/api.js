export async function getCoordinates(postalCode) {
    const response = await fetch(
        `http://127.0.0.1:8000/geocode?postal_code=${postalCode}`
    );

    if (!response.ok) {
        throw new Error("PLZ konnte nicht gefunden werden.");
    }

    return await response.json();
}


export async function getStations(latitude, longitude, fuel, radius) {
    const response = await fetch(
        `http://127.0.0.1:8000/stations?lat=${latitude}&lng=${longitude}&fuel=${fuel}&radius=${radius}`
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Tankstellen konnten nicht geladen werden."
        );
    }

    return await response.json();
}