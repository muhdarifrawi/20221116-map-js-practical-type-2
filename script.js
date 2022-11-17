
function createMap() {
    var map = L.map('map').setView([1.3521, 103.8198], 12);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    return map
}

async function taxiData() {
    let response = await axios.get("https://api.data.gov.sg/v1/transport/taxi-availability");
    let taxiCoordinates = response.data["features"][0]["geometry"]["coordinates"];
    return taxiCoordinates
}

async function busData() {
    let response = await axios.get("https://gist.githubusercontent.com/kunxin-chor/b0a3e50161cd7a53d1bcdc5cc93b11fe/raw/05716c38af2b960d0f34d4db1fef6ce38d42455e/bus-stop.json");
    let busCoordinates = response.data
    return busCoordinates
}


async function plotMap(){
    let map = createMap();

    let taxiCoordinates = await taxiData();
    var taxis = new L.MarkerClusterGroup();
    for(let t of taxiCoordinates){
        let taxiLat = t[1]
        let taxiLong = t[0]
        L.marker([taxiLat,taxiLong]).addTo(taxis);
    }
    

    let busCoordinates = await busData();

    let buses = L.layerGroup();
    for(let b in busCoordinates){
        let busLat = busCoordinates[b][1]
        let busLong = busCoordinates[b][0]

        L.circle([busLat, busLong], {
            color: 'blue',
            fillColor: ' #2892fe ',
            fillOpacity: 0.5,
            radius: 10
        }).addTo(buses)
    }
    taxis.addTo(map);

    document.querySelector("#plot-1").addEventListener("click", function(){
        map.removeLayer(buses);
        map.addLayer(taxis);

    });
    document.querySelector("#plot-2").addEventListener("click", function(){
        map.removeLayer(taxis);
        map.addLayer(buses);
    });
}

plotMap();

