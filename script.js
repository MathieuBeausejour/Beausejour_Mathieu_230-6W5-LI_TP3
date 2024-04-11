var map = L.map('carte').setView([0,0], 3);

new L.basemapsSwitcher([
    {
      layer: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      }).addTo(map), //DEFAULT MAP
      icon: 'images/Capture2.PNG',
      name: 'Fond de carte 1'
    },
    {
      layer: L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }), 
      icon: 'images/Capture1.PNG',
      name: 'Fond de carte 2'
    },
    {
      layer: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }),
      icon: 'images/Capture3.PNG',
      name: 'Fond de carte 3'
    },
  ], { position: 'topright' }).addTo(map);

 L.control.scale().addTo(map);

function createCustomIcon (feature, latlng) {
  let myIcon = L.icon({
    iconUrl: 'images/lieu.png',
    iconSize:     [25, 25], // width and height of the image in pixels
    shadowSize:   [35, 20], // width, height of optional shadow image
    iconAnchor:   [12, 12], // point of the icon which will correspond to marker's location
    shadowAnchor: [12, 6],  // anchor point of the shadow. should be offset
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
  })
  return L.marker(latlng, { icon: myIcon })
}

//icons 
var un = L.icon({
  iconUrl: 'images/mag_eleve.png',
  iconSize: [25, 25],
iconAnchor: [10, 10]
});

var deux = L.icon({
iconUrl: 'images/mag_moyen_haut.png',
iconSize: [25, 25],
iconAnchor: [15, 15]
});
var trois = L.icon({
iconUrl: 'images/mag_moyen_bas.png',
iconSize: [25, 25],
iconAnchor: [10, 10]
});

var quatre = L.icon({
iconUrl: 'images/mag_bas.png',
iconSize: [25, 25],
iconAnchor: [10, 10]
});


setInterval(loadGeoJSONFromAPI, 1000);
function loadGeoJSONFromAPI() {
  var point = fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson')
      .then(response => response.json())
      .then(data => {
          tremblement = data;
          // Ajouter le GeoJSON à la carte

          for (let i = 0; i < tremblement.features.length; i++) {
              const tremblementData = tremblement.features[i];
              const mag = tremblementData.properties.mag;
              const lon = tremblementData.geometry.coordinates[0];
              const lat = tremblementData.geometry.coordinates[1];

              if (mag >= 6) {
                  L.marker([lat, lon], { icon: un }).addTo(map);
              } else if (mag >= 5 && mag <= 5.9) {
                  L.marker([lat, lon], { icon: deux }).addTo(map);
              } else if (mag > 2 && mag <= 4.9) {
                  L.marker([lat, lon], { icon: trois }).addTo(map);
              } else if (mag <= 2) {
                  L.marker([lat, lon], { icon: quatre }).addTo(map);
              }
          }
      });
}



// Appeler la fonction pour charger le GeoJSON depuis l'API
loadGeoJSONFromAPI();

// RI =  Dorsale TR = Fausse Th = Ligne de chavauchemenet

function styleLigne(feature) {
  var valeur = feature.properties.datatype;

  // Définir des seuils et les styles correspondants
  if (valeur === 'RI') {
      return { color: 'green', weight: 3, opacity: 0.7 };
  }
  else if (valeur === 'TR') {
    return { color: 'blue', weight: 3, opacity: 0.7 };
  }
  else {
      return { color: 'red', weight: 3, opacity: 0.7 };
  }
}

var ligne = L.geoJSON(failles, {
style: styleLigne ,
}).addTo(map);

var polygone = new L.GeoJSON(plaque, {
  style: function (feature) {
    return {
      fillColor: 'blue', // Couleur de remplissage
      fillOpacity: 0.3, // Opacité de remplissage
      weight: 2 // Désactive le contour
    };
  }
}).addTo(map);
  

//Ajouter des étiquettes à la couche GeoJSON basées sur la propriété 'geogdesc'
polygone.eachLayer(function(layer) {
  if (layer.feature.properties && layer.feature.properties.PlateName) {
      var PlateName = layer.feature.properties.PlateName;
      layer.bindTooltip(PlateName, { permanent: true }).openTooltip(); // Utilisation de bindTooltip
  }
});

const legend = L.control.Legend({
  position: "bottomright",
  collapsed: false,
  symbolWidth: 25,
  symbolHeight:25,
  opacity: 0.8,
  column: 1,
  title:'Magnitude',
  legends: [{
      label: ">= 6",
      type: "image",
      url: "images/mag_eleve.png",
  },
  {
    label: "5 - 5.9",
    type: "image",
    url: "images/mag_moyen_haut.png",
},
{
  label: "2 - 4.9",
  type: "image",
  url: "images/mag_moyen_bas.png",
},
{
  label: "<=2",
  type: "image",
  url: "images/mag_bas.png",
},
{
  label: "Failles et fosse océaniques",
  type: "image",
  url: "images/mag.png",
},
{
  label: "Dorsale",
  type: "polyline",
  color: "green",
},
{
  label: "Fosse",
  type: "polyline",
  color: "blue",
},
{
  label: "Ligne de chevauchement",
  type: "polyline",
  color: "red",
}]
})
.addTo(map);

var overlays = {
  "Failles et fosse océaniques": ligne,
  "Plaques techtoniques":polygone
};

L.control.layers(overlays).addTo(map);