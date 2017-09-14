var map;
//var names = [];
var mapfeatures;
var marker;
var list = [];
var markers = [];
var i;
var locs; 
var locations;
var OAlocations;
var obsarray;
var infoWindow;
var defaultIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"; 
var clickIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";


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
    ko.options.useOnlyNativeEvents = true;  //use KO native event binding and not JQuery

    ko.applyBindings(new appViewModel());
}




//MODEL
function getData(obsarray){
    //used converted esri JSON file to display locations
    //mapfeatures = map.data.loadGeoJson('CountyBuildings.geojson');
    
    /*$.getJSON('CountyBuildings.geojson', function(data){
        mapfeatures = map.data.addGeoJson(data);
        console.log(mapfeatures.length);


    });*/

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
            //create array of location names and marker info
            locs = [];
            for (i=0; i<data.features.length; i++){
                var lat = data.features[i].properties.Lat;
                var lng = data.features[i].properties.Long;
                
                locs.push({
                    "id": data.features[i].properties.FID,
                    "name": data.features[i].properties.NAME, 
                    "address": data.features[i].properties.ADDRESS,
                    "phone": data.features[i].properties.PHONE,
                    "position": {"lat": lat, "lng": lng},
                    "setVisible": true,
                });
            }

            //loop through array of and place markers on map
            for (i=0; i<locs.length; i++){
                marker = new google.maps.Marker({
                    position: locs[i].position,
                    icon: defaultIcon,
                    map: map,
                });

              /*  var contentInfo = "<b>" + locs[i].name + "</b><br>" + locs[i].address + "<br>" + "<a href='tel:+" + locs[i].phone + "'>" + locs[i].phone + "</a>";
                console.log(contentInfo);*/

               /* infoWindow = new google.maps.InfoWindow({
                    content: contentInfo
                });*/

                /*var anchor = new google.maps.MVCObject();
                anchor.set("position", event.latLng);
                //infoWindow.open(map, anchor);
                marker.addListener('click', function(marker, i){
                    infoWindow = new google.maps.InfoWindow()
;                    infoWindow.setContent(contentInfo)
                    infoWindow.open(map, anchor);
                });*/

            //marker info windows
                var infoWindow = new google.maps.InfoWindow(), marker, i;
                createMarkers(marker, i);
                /*google.maps.event.addListener(marker, 'click', (function(marker, i){
                    return function() {
                        content = "<b>" + locs[i].name + "</b><br>" + locs[i].address + "<br>" + "<a href='tel:+" + locs[i].phone + "'>" + locs[i].phone + "</a>";
                        console.log(content);
                        infoWindow.setContent(content);
                        infoWindow.open(map, marker);
                    }
                })(marker, i));

                marker.addListener('mouseover', function(){
                    this.setIcon(clickIcon);
                });

                marker.addListener('mouseout', function(){
                    this.setIcon(defaultIcon);
                });*/

                //map.fitBounds(bounds);     
            }
        
                
            console.log(locs);
            //filter array for unique location names; use with SHORT_NAME
            //ulist = $.unique(list);  //if updating to 3.0 jQuery use $.uniqueSort()   
            //console.log(ulist.length);
            
            //make array of objects with name property
            /*locs = [];
            for (i=0; i<ulist.length; i++){
                locs.push({"name": ulist[i]});              
            }
            console.log(locs);*/
            
            obsarray(locs);      
            console.log(obsarray());
            
            
            
        }
    });
}   

function createMarkers(marker, i){
    //TODO fix "TypeError: Cannot read property 'name' of undefined" when location clicked a 2nd time
    google.maps.event.addListener(marker, 'click', (function(marker, i){
                    return function() {
                        content = "<b>" + locs[i].name + "</b><br>" + locs[i].address + "<br>" + "<a href='tel:+" + locs[i].phone + "'>" + locs[i].phone + "</a>";
                        console.log(content);
                        infoWindow.setContent(content);
                        infoWindow.open(map, marker);
                        for (i = 0; i < markers.length; i++){
                            markers[i].setIcon(defaultIcon);
                        }
                        marker.setIcon(clickIcon);
                        
                    };
                })(marker, i));
                markers.push(marker);


                /*marker.addListener('mouseover', function(){
                    this.setIcon(clickIcon);
                });*/

                /*marker.addListener('mouseout', function(){
                    this.setIcon(defaultIcon);
                });*/
}   

//show popup for location clicked in list
function showSelected(data) {  
    console.log(data.length);
    if (data.length === 0){
        return;
    } else {    
        console.log("hit");
        console.log(data);  
        infoWindow.close();
        infoWindow = new google.maps.InfoWindow();

        content = "<b>" + data.name + "</b><br>" + data.address + "<br>" + "<a href='tel:+" + data.phone + "'>" + data.phone + "</a>";
        console.log(content);
        infoWindow.setContent(content);
        var anchor = new google.maps.MVCObject();
        anchor.set("position", data.position);
        infoWindow.open(map, anchor);
    }
}



/*function removeMarkers(){
    map.data.forEach(function(feature){
        //add filter constraints
        map.data.remove(feature);
    });
}*/

    
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

    self.allPlaces = [];

    self.OAlocations = ko.observableArray();
    getData(self.OAlocations);



    self.filter = ko.observable('');
    self.filtered = ko.computed(function(){
         //if self.filter is empty, return the obs array
        if (!self.filter()){
            //set all markers to visible  -->  setVisible(true)
            for (i = 0; i < self.OAlocations().length; i++){
                if (self.OAlocations()[i].name.toLowerCase().indexOf(filter) !== -1) {
                    self.OAlocations()[i].setVisible = true;    
                    self.allPlaces.push(self.OAlocations()[i]);
                    console.log(self.allPlaces);      
                    return self.allPlaces[i].name.toLowerCase().indexOf(filter) !== -1;          
                }  else {
                   self.OAlocations()[i].setVisible = false;
                   //console.log(self.OAlocations()[i]);
                }
                
            }
            console.log(self.OAlocations());
            return self.OAlocations();
        } else {
            //removeMarkers();
            var filter = self.filter().toLowerCase();
            //self.allPlaces.push(self.OAlocations());
            //console.log(self.allPlaces);
            //self.OAlocations.removeAll();
            console.log(self.OAlocations().length); 
            
            
            

            /*return ko.utils.arrayFilter(self.OAlocations(), function(item){
            return item.name.toLowerCase().indexOf(filter) > -1;
            });*/
            

                    
        };
    });

    




    /*function clearList(){
        console.log("it works - I hate KO!!!!")
    }*/


    
        
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

 
