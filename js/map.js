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

    //used converted esri JSON file to display locations
    map.data.loadGeoJson('CountyBuildings.geojson');
    /*map.data.setStyle({
        fillColor: 'blue'
        
    });*/

    var features = $.getJSON('CountyBuildings.geojson');
    console.log(features);

    //create infoWindow 
    infoWindow = new google.maps.InfoWindow ({
        content: ""
    }); 

    //click event for markers and create infoWindow data
    map.data.addListener('click', function(event){
        name = event.feature.f.NAME;
        address = event.feature.f.ADDRESS;
        phone = event.feature.f.PHONE;
        content = "<b>" + name + "</b><br>" + address + "<br>" + "<a href='tel:+" + phone + "'>" + phone + "</a>"
        console.log(content);
        infoWindow.setContent(content);
        var anchor = new google.maps.MVCObject();
        anchor.set("position", event.latLng);
        infoWindow.open(map, anchor);
    })

    
}