var map = L.map('carte').setView([46.81794199604048, -71.21544833194406],12);

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

 var geojsonFeature = lieux;

 function createCustomIcon(feature, latlng) {
   let myIcon = L.icon({
     iconUrl: 'images/lieu.png',
     iconSize: [25, 25], // Largeur et hauteur de l'image en pixels
     shadowSize: [35, 20], // Largeur et hauteur de l'image d'ombre optionnelle
     iconAnchor: [12, 12], // Point de l'icône qui correspondra à l'emplacement du marqueur
     shadowAnchor: [12, 6], // Point d'ancrage de l'ombre. devrait être décalé
     popupAnchor: [0, 0] // Point à partir duquel la fenêtre contextuelle doit s'ouvrir par rapport à iconAnchor
   });
   
   let marker = L.marker(latlng, { icon: myIcon });
   
   // Ajoute un popup avec le nom et la description des lieux
   let popupContent = "<b>" + feature.properties.Nom + "</b><br>" + feature.properties.Description;
   marker.bindPopup(popupContent);
   
   return marker;
 }
 
 let myLayerOptions = {
   pointToLayer: createCustomIcon
 };
 
 var test = L.geoJSON(geojsonFeature, myLayerOptions).addTo(map);

var quartiers = new L.GeoJSON(quartier, {
  style: function (feature) {
    return {
      fillColor: 'green', // Couleur de remplissage
      fillOpacity: 0, // Opacité de remplissage
      color:'orange',
      weight: 2 // Désactive le contour
    };
  }
}).addTo(map);


 var arrondissement = new L.GeoJSON(arron, {
  style: function (feature) {
    return {
      fillColor: 'blue', // Couleur de remplissage
      fillOpacity: 0, // Opacité de remplissage
      weight: 2 // Désactive le contour
    };
  }
}).addTo(map);

const legend = L.control.Legend({
  position: "bottomright",
  collapsed: false,
  symbolWidth: 25,
  symbolHeight: 25,
  opacity: 0.8,
  column: 1,
  legends: [{
    label: "  Lieux historiques",
    type: "image",
    url: "images/lieu.png",
  },
  {
    label: "-   Quartiers de la ville de Québec",
    type: "polyline",
    weight: 2,
    color: "orange"
  },
  {
    label: "-   Arrondissements de la ville de Québec",
    type: "polyline",
    weight: 2,
    color: "blue"
  }]
})
.addTo(map);

var overlays = {
  "Lieux historiques": test,
  "Quartiers de la ville de Québec":quartiers,
  "Arrondissement de la ville de Québec":arrondissement
};

L.control.layers(overlays).addTo(map);