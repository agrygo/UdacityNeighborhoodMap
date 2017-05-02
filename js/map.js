var map;
/*var arcgis = 'CountyBuildings.json';
var FeatureCollection = {
  type: "FeatureCollection",
  features: []
}

for (var i = 0; i < arcgis.features.length; i++) {
  var feature = Terraformer.ArcGIS.parse(arcgis.features[i]);
  feature.id = i;
  FeatureCollection.features.push(feature)
};
*/
function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.563513 , lng: -107.546957},  //approx center in New Castle
        zoom: 10
    });

    //used converted esri JSON file 
    map.data.loadGeoJson('../data/CountyBuildings.geojson');
    /*map.data.setStyle({
        icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"    
        
    });*/

    
}