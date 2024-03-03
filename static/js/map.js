function markerSize(population) {
  return Math.sqrt(population) * 7;
}

// Creating the map object
let myMap = L.map("map", {
  center: [43.7032, -79.3832],
  zoom: 12
});

// Adding the tile layer
let map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the GeoJSON data.
//let geoData = "https://fgsalomao.github.io/Project-3/resources/Neighbourhood_Crime_Rates_Open_Data.geojson";
let geoData = "https://fgsalomao.github.io/Project-3/resources/Neighbourhood_Crime_Rates_Open_Data_Extended.geojson";

// Get the data with d3.
d3.json(geoData).then(function(data) {

  console.log(data);

  // Create a new choropleth layer.
  let geojson = L.choropleth(data, {

    // Define which property in the features to use.
    valueProperty: "total_crime",

    // Set the color scale.
    scale: ["#10ed0c","#ffffb2", "#b10026"],

    // The number of breaks in the step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.7
    },

    // Binding a popup to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "<strong>" + feature.properties.AREA_NAME + "</strong>" +
        "<br /><br /><strong> Total Crime from 2014 to 2023: " + feature.properties.total_crime + "</strong>" +
        "<br /><br />Shooting: " + feature.properties.SHOOTING_total + 
        "<br /><br />Autotheft: " + feature.properties.AUTOTHEFT_total + 
        "<br /><br />Biketheft: " + feature.properties.BIKETHEFT_total + 
        "<br /><br />Breakenter: " + feature.properties.BREAKENTER_total
        );
    }
  }).addTo(myMap);

  // Set up the legend.
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let limits = geojson.options.limits;
    let colors = geojson.options.colors;
    let labels = [];

    // Add the minimum and maximum.
    let legendInfo = "<h1># of Crime 2014 - 2023</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);

  // Heat map
  let heatArray = [];
  features = data.features;

  for (let i = 0; i < features.length; i++) {
    /* let location = features[i].geometry;
    if (location) {
      console.log(location);
      heatArray.push([location.coordinates[1], location.coordinates[0]]);
    } */
    if ((features[i].geometry && features[i].geometry.coordinates))
    {
      var latlngs = features[i].geometry.coordinates[0];
      var polygon = L.polygon(latlngs, {color: 'red'});
      let center = polygon.getBounds().getCenter();
      /* for (let j = 0; j < features[i].properties.total_crime; j++)
      {
        heatArray.push([center.lat,center.lng]);
      } */
      //heatArray.push([center.lng,center.lat,features[i].properties.total_crime/geojson.options.limits[geojson.options.limits.length-1]]);
      heatArray.push([center.lng,center.lat,features[i].properties.total_crime]);
      //console.log(center);
      //console.log(geojson.options.limits[geojson.options.limits.length-1]);
    }
    /* else {
      console.log(features[i].properties.AREA_NAME);
    } */

  }
  console.log(heatArray);
  let heat = L.heatLayer(heatArray, {
    radius: 25,
    blur: 35
  });

  // Population Bubble
  let info_markers = [];
  let pop_bubbles = [];

  for (let i = 0; i < features.length; i++) {
    if ((features[i].geometry && features[i].geometry.coordinates))
    {
      var latlngs = features[i].geometry.coordinates[0];
      var polygon = L.polygon(latlngs, {color: 'red'});
      let center = polygon.getBounds().getCenter();
      pop_bubbles.push(
        L.circle([center.lng,center.lat], {
          stroke: false,
          fillOpacity: 0.75,
          color: "#09cbed",
          fillColor: "#09cbed",
          radius: markerSize(features[i].properties.population_2023)
        })
      );
      info_markers.push(
        L.marker([center.lng,center.lat])
        .bindPopup(
          "<strong>" + features[i].properties.AREA_NAME + "</strong>" +
          "<br /><strong> 2023 Polulation: " + features[i].properties.population_2023 + "</strong><hr>" +
          "<br /><strong> Total Crime from 2014 to 2023: " + features[i].properties.total_crime + "</strong>" +
          "<br /><br />Shooting: " + features[i].properties.SHOOTING_total + 
          "<br /><br />Autotheft: " + features[i].properties.AUTOTHEFT_total + 
          "<br /><br />Biketheft: " + features[i].properties.BIKETHEFT_total + 
          "<br /><br />Breakenter: " + features[i].properties.BREAKENTER_total
          )
      );
    }
  }

  let map_bubbles = L.layerGroup(pop_bubbles);
  let map_markers = L.layerGroup(info_markers).addTo(myMap);

  let choro_group = L.layerGroup(geojson);

  // Controls
  let baseMaps = {
    Choropleth: geojson,
    "Heap Map": heat
  };

  let overlayMaps = {
    "Markers": map_markers,
    "Population Bubble": map_bubbles
  };

  L.control.layers(baseMaps,overlayMaps,{
    collapsed: false
  }).addTo(myMap);

});
