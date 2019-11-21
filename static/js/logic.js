// Link below provided in the student read me file 
var URL_earthquake_usgs = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// In order to perform a request to the query URL
d3.json(URL_earthquake_usgs, function(data) {

    create_data_Features(data.features);
});

function create_data_Features(earthquakeData) {

    // Defining my function and run it for each feature

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3><h3>Location: " + feature.properties.place +
                "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        },

        pointToLayer: function(feature, latlng) {
            return new L.circle(latlng, {
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.properties.mag),
                fillOpacity: .6,
                color: "#000",
                stroke: true,
                weight: .10
            })
        }
    });


    // In order to send the earthquakes layer to creat_earthquakee_Map function
    create_earthquake_Map(earthquakes);
}


function create_earthquake_Map(earthquakes) {

    // To define my darkmap and streetmap
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1Ijoic2FuamFyNTUiLCJhIjoiY2sycnJveGo2MGkxeDNvbzg4MG00djNmciJ9.6JaYJuT_t8uVeYmkBjVasQ.");

    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1Ijoic2FuamFyNTUiLCJhIjoiY2sycnJveGo2MGkxeDNvbzg4MG00djNmciJ9.6JaYJuT_t8uVeYmkBjVasQ.");

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1Ijoic2FuamFyNTUiLCJhIjoiY2sycnJveGo2MGkxeDNvbzg4MG00djNmciJ9.6JaYJuT_t8uVeYmkBjVasQ.");

    // In order to define a baseMaps
    // Pass in our baseMaps 
    var baseMaps = {
        "Outdoors": outdoors,
        "Satellite": satellite,
        "Dark Map": darkmap
    };

    // In order to create overlay 
    var overlayMaps = {
        "Earthquakes": earthquakes

    };

    // Create our map
    var myMap = L.map("map", {
        center: [
            29.7174, -95.4018
        ],
        zoom: 5.25,
        layers: [outdoors, earthquakes]
    });


    // To add the layerto the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);

    //For legend on the bottom left
    var legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];

        // Loop through 
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(myMap);
}


//Design color for the circle  
function getColor(d) {
    return d > 5 ? "#a54500" :
        d > 4 ? "#cc5500" :
        d > 3 ? "#ff6f08" :
        d > 2 ? "#ff9143" :
        d > 1 ? "#ffb37e" :
        "#ffcca5";
}

//Change the maginutde of the earthquake by a factor of 45,000 
function getRadius(value) {
    return value * 45000
}