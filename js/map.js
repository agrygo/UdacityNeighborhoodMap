var map;
//var names = [];
var list = [];
var locs; 
var locations;
var OAlocations;
var obsarray;

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

//VIEW
function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.563513 , lng: -107.546957},  //approx center in New Castle
        zoom: 10
    });

    //getData();
    ko.applyBindings(new appViewModel());
}




//MODEL
function getData(obsarray){
    //used converted esri JSON file to display locations
    map.data.loadGeoJson('CountyBuildings.geojson');
    /*map.data.setStyle({
        icon: 'http://localhost/~andreagrygo/NeighborhoodMap/content/map-marker.svg'
        
    });*/

    /*$.getJSON('CountyBuildings.geojson', function(data){
        console.log(data);
        console.log(data.features.length);
        for (i=0; i<data.features.length; i++){
            names.push(data.features[i].properties.SHORT_NAME);
        }
        console.log(names);    
    });*/
    
    //ajax call to get feature information from geojson file
    $.ajax({
        dataType: 'json',
        url: 'CountyBuildings.geojson',
        //not passing any data: parameters such as query
        success: function(data){
            console.log(data);
            console.log(data.features.length);
            for (i=0; i<data.features.length; i++){
                list.push(data.features[i].properties.NAME);
            }
            console.log(list);
            //filter array for unique location names
            //locs = $.unique(list);  //if updating to 3.0 jQuery use $.uniqueSort()
            //console.log(locs);
            
            //make array of objects with name property
            locs = [];
            for (i=0; i<list.length; i++){
                locs.push({"name": list[i]});              
            }
            console.log(locs);
            
            obsarray(locs);      
            console.log(obsarray());
            
        }
    });
}   



    
//VIEW MODEL  (set up KO) 
function appViewModel(locations) {   
    var self = this;
   //create infoWindow 
    infoWindow = new google.maps.InfoWindow ({
        content: ""
    }); 

    //click event for markers and set infoWindow data
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
    });

    self.OAlocations = ko.observableArray();
    getData(self.OAlocations);

    self.filter = ko.observable();
    self.filtered = ko.computed(function(){
         //if self.filter is empty, return the obs array
        console.log("kocomputed");
        if (!self.filter()){
            return self.OAlocations();
        } else {
            var filter = self.filter().toLowerCase();
            return ko.utils.arrayFilter(self.OAlocations(), function(item){
            return item.name.toLowerCase().indexOf(filter) > -1;
            });
        }
    });


    
        
}

 //views for locations list; init fxn stores connections, render shows locations
/*var locationsListView = {
    alert("in view");
    init: function(){
        //DOM element for location name
        this.locListElem = document.getElementById('locationList');

        //update list in DOM with location names
        this.render()
    },

    render: function(){
        //use global locations list

        //create empty locations list
        this.locListElem.innerHTML = "";

        console.log(locations);

        //loop over locations and populate list
        for (i=0; i<locations.length; i++){
            elem = document.createElement('li');
            elem.textContent = location;
            this.locListElem.appendChild(elem);
        }
    }
};
  */ 

 
