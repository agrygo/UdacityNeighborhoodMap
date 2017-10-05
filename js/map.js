var map;
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
var selectMarker;
var flickrURL;

//VIEW
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 39.55927808610271, 
      lng: -107.24208639453127
    }, //approx center in New Castle
    zoom: 9
  });

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

      //push locs to observable array so locations populate
      obsarray(locs);      
      console.log(obsarray());
    }
  });
}

//show popup for location clicked in list; KO binding on click   
function showSelected(data) {
  //set previously selected marker to default color
  if (selectMarker) {
    console.log(selectMarker);  
    selectMarker.setIcon(defaultIcon);
    console.log(data);
  }
  if (data.length === 0) {
    return;
  } else {
    infoWindow.close();
    infoWindow = new google.maps.InfoWindow({
      pixelOffset: new google.maps.Size(0, -20) //negative y-offset sends the InfoWindow up
    });
    content = "<b>" + data.name + "</b><br>" + data.address + "<br>" + "<a href='tel:+" + data.phone + "'>" + data.phone + "</a>";
    /*infoWindow.setContent(content);
    var anchor = new google.maps.MVCObject();
    anchor.set("position", data.position);
    infoWindow.open(map, anchor);
    //change marker color
    console.log(data.marker);
    selectMarker = data.marker;
    console.log(data.position);
    data.marker.setIcon(clickIcon);
    map.panTo(data.marker.position);
    map.setZoom(17);
*/
    //flickr photos
    /*use flickr.photos.search
      https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=84316c08976186b3699de0acd92ec172&lat=39.5461&lon=-107.782&per_page=10&format=json&nojsoncallback=1
    */
    var lat = data.position.lat;
    var lng = data.position.lng;
    console.log(lat + lng); 
    var api_key = "84316c08976186b3699de0acd92ec172";
    $.ajax({
    dataType: 'json',
    url: "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + api_key + "&lat=" + lat + "&lon=" + lng + "&per_page=10&format=json&nojsoncallback=1",
    success: function(data) {
      console.log(data);
      //create array of photos
      //photos = [];
      for (i = 0; i < data.photos.photo.length; i++) {
        var farm = data.photos.photo[i].farm;
        var server = data.photos.photo[i].server;
        var secret = data.photos.photo[i].secret;
        var id = data.photos.photo[i].id;
      }   
      //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
      flickrURL = "https://farm" + farm + ".staticflickr.com/" + server + "/" + id + "_" + secret +  ".jpg";
      console.log(flickrURL);
      setInfoWindow(flickrURL);
    }
    });

    function setInfoWindow(flickrURL){
      console.log(flickrURL);
      infoWindow.setContent(content + "<br>" + "<img src=" + flickrURL + "/>");
      //optional gallery display
      //$('#gallery').append("<img src=" + flickrURL + "style='max-height:125px;'" + "/>")
      var anchor = new google.maps.MVCObject();
      anchor.set("position", data.position);
      infoWindow.open(map, anchor);
      //change marker color
      console.log(data.marker);
      selectMarker = data.marker;
      console.log(data.position);
      data.marker.setIcon(clickIcon);
      map.panTo(data.marker.position);
      map.setZoom(17);
    }
  }
} 

//show side nav panel
$('#btn-panel').click(function(){
  $('#panel-collapse').css({"width": "310px"});
  $('#map').css({"marginRight": "300px"});
  $('.btn-map').css({'marginRight': '300px'});
});

//close side nav panel
$('#btn-close').click(function(){
  $('#panel-collapse').css({"width": "0"});
  $('#map').css({"marginRight": "0"});
  $('.btn-map').css({'marginRight': '20px'});
})


//VIEW MODEL  (set up KO) 
function AppViewModel(locations) {
  var self = this;
  infoWindow = new google.maps.InfoWindow({
    content: ""
  });

  //click event for markers and set infoWindow data
  map.data.addListener('click', function(event) {
    name = event.feature.f.NAME;
    address = event.feature.f.ADDRESS;
    phone = event.feature.f.PHONE;
    content = "<b>" + name + "</b><br>" + address + "<br>" + "<a href='tel:+" + phone + "'>" + phone + "</a>"
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
  //if self.filter is empty, return the obs array
    if (!self.filter()){
        //set all markers to visible  -->  setVisible(true)
        for (i = 0; i < self.OAlocations().length; i++){
            if (self.OAlocations()[i].name.toLowerCase().indexOf(filter) !== -1) {
                self.OAlocations()[i].setVisible = true;    
                self.allPlaces.push(self.OAlocations()[i]);
                return self.allPlaces[i].name.toLowerCase().indexOf(filter) !== -1;          
            }  else {
               self.OAlocations()[i].setVisible = false;
            }
        }
        //populate location list in table
        self.OAlocations().forEach(function(location){
            if (location.marker){
                location.marker.setVisible(true);
            }
        });
         return self.OAlocations();
    } else {
        var filter = self.filter().toLowerCase();  //filter = <input> text value
        self.allPlaces.push(self.OAlocations());
        console.log(self.OAlocations());
        
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