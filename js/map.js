const mapElement = document.getElementById('campus-map');
const centerButton = document.getElementById('center-campus');
const leaflet = window.L;

if (!mapElement || !centerButton) {
    console.error('Map markup is incomplete; expected #campus-map and #center-campus.');
} else if (!leaflet || !leaflet.map || !leaflet.tileLayer || !leaflet.marker) {
    console.error('Leaflet did not load. Check the installed Leaflet assets and script paths.');
} else {
    const campusCoordinates = [41.2259223, -85.8176565];
    const campusMap = leaflet.map(mapElement).setView(campusCoordinates, 17);

    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(campusMap);

    leaflet.marker(campusCoordinates)
        .addTo(campusMap)
        .bindPopup('<strong>Grace Theological Seminary</strong><br>200 Seminary Drive<br>Winona Lake, IN 46590');

    centerButton.addEventListener('click', () => campusMap.setView(campusCoordinates, 17));
}
