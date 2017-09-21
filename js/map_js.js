var map;
//var names = [];
var mapfeatures;
var marker;
var list = [];
var markers = [];
var locs;
var locations;
var OAlocations;
var obsarray;
var infoWindow;
var defaultIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
var clickIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
var appViewModel;
var infoWindow;

//VIEW
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 39.563513,
      lng: -107.546957
    }, //approx center in New Castle
    zoom: 10
  });

  //getData();
  ko.options.useOnlyNativeEvents = true; //use KO native event binding and not JQuery
  appViewModel = new AppViewModel()
  ko.applyBindings(appViewModel);
}




//MODEL
function getData(obsarray) {

  //ajax call to get feature information from geojson file
  $.ajax({
    dataType: 'json',
    url: 'CountyBuildings.geojson',
    //not passing any data: parameters such as query
    success: function(data) {
    //  console.log(data);
      console.log(data.features.length);
      //create array of location names and marker info
      locs = [];
      for (i = 0; i < data.features.length; i++) {
        var lat = data.features[i].properties.Lat;
        var lng = data.features[i].properties.Long;

        locs.push({
          "id": data.features[i].properties.FID,
          "name": data.features[i].properties.NAME,
          "address": data.features[i].properties.ADDRESS,
          "phone": data.features[i].properties.PHONE,
          "position": {
            "lat": lat,
            "lng": lng
          },
          "setVisible": true,
        });
      }

      //loop through array of and place markers on map
      locs.forEach(function(loc){
        loc.marker = new google.maps.Marker({
          position: loc.position,
          icon: defaultIcon,
          map: map,
        });
        loc.marker.addListener('click', function(){
          content = "<b>" + loc.name + "</b><br>" + loc.address + "<br>" + "<a href='tel:+" + loc.phone + "'>" + loc.phone + "</a>";
          infoWindow.setContent(content);
          console.log(loc); 
          
          infoWindow.open(map, this);
          for (i = 0; i < locs.length; i++) {
            locs[i].marker.setIcon(defaultIcon);
          }
          this.setIcon(clickIcon);
        })
      });

    }
  });
}
/*function createMarkers(marker, i) {
  //TODO fix "TypeError: Cannot read property 'name' of undefined" when location clicked a 2nd time
  google.maps.event.addListener(marker, 'click', (function(marker, i) {
    return function() {
      //content = "<b>" + locs[i].name + "</b><br>" + locs[i].address + "<br>" + "<a href='tel:+" + locs[i].phone + "'>" + locs[i].phone + "</a>";
      //infoWindow.setContent(content);
     // console.log(locs[i]); //on 2nd click returns undefined.....?
      
    };
  })(marker, i));
  markers.push(marker);

}*/

//show popup for location clicked in list
function showSelected(data) {
  for (i = 0; i < markers.length; i++) {
    markers[i].setIcon(defaultIcon);
  }
  //console.log(data.length);
  if (data.length === 0) {
    return;
  } else {
//    console.log("hit");
//    console.log(data);
    infoWindow.close();
    infoWindow = new google.maps.InfoWindow({
      pixelOffset: new google.maps.Size(0, -20) //negative y-offset sends the InfoWindow up
    });

    content = "<b>" + data.name + "</b><br>" + data.address + "<br>" + "<a href='tel:+" + data.phone + "'>" + data.phone + "</a>";
 //   console.log(content);
    infoWindow.setContent(content);
    var anchor = new google.maps.MVCObject();
    anchor.set("position", data.position);
    infoWindow.open(map, anchor);
    //TODO  change marker color 

  }
}

//VIEW MODEL  (set up KO) 
function AppViewModel(locations) {
  var self = this;
  //create infoWindow 
  infoWindow = new google.maps.InfoWindow({
    content: ""
  });

  //click event for markers and set infoWindow data
  map.data.addListener('click', function(event) {
    name = event.feature.f.NAME;
    address = event.feature.f.ADDRESS;
    phone = event.feature.f.PHONE;
    content = "<b>" + name + "</b><br>" + address + "<br>" + "<a href='tel:+" + phone + "'>" + phone + "</a>"
   // console.log(content);
    infoWindow.setContent(content);
    var anchor = new google.maps.MVCObject();
    anchor.set("position", event.latLng);
    infoWindow.open(map, anchor);
  });

  self.allPlaces = [];

  self.OAlocations = ko.observableArray();
  getData(self.OAlocations);

  self.filter = ko.observable('');
  self.filtered = ko.computed(function() {
    debugger;
    //if self.filter is empty, return the obs array
    var filter = self.filter().toLowerCase(); //filter = <input> text value
    if (!self.filter()){
            //set all markers to visible  -->  setVisible(true)
            console.log (self.OAlocations());
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
            //populate location list in table
            self.OAlocations().forEach(function(location){
                if (location.marker){
                    location.marker.setVisible(true);
                }
            });
             return self.OAlocations();
        


      //display filter list based on input value
      return ko.utils.arrayFilter(self.OAlocations(), function(item) {
        var name = item.name.toLowerCase();
        var matched = name.indexOf(filter) > -1; // true or false

        console.log(name, filter, matched);

        item.marker.setVisible(matched);
        
        return matched; // true or false
      });


    };
  });
}