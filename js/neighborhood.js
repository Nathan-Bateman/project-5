var defMapOptions = {
  zoom: 16,
  center: new google.maps.LatLng(13.66448,100.66160)
}
var map = new google.maps.Map(document.getElementById('map-canvas'), defMapOptions);
function initialize() {
  var myLatlng = defMapOptions.center;
  var mapOptions = defMapOptions;
}
 google.maps.event.addDomListener(window, 'load', initialize);
//default content for info windows
  var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      'sandstone rock formation in the southern part of the '+
      'Northern Territory, central Australia.'+
      '</div>'+
      '</div>';
// variable that is the one and only info window of the page..must figure out how to change content
  var infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 200
  });

// function to add people to map
var Person = function (name, title, lat, long) {
 this.name = ko.observable(name);
 this.title = ko.observable(title);
 this.lat = ko.observable(lat);
 this.long = ko.observable(long);
 this.nameTitle = ko.computed(function() {
 return this.name() + " " + this.title();
 }, this);


 }
 //empty array to hold markers
 var markers = [];
//function to add a marker to the markers array
var addMarker = function (lat, long, title) {
    this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat,long),
    map: map,
    title: title

  });
    markers.push(this.marker);
 }
//put all markers on map with info windows
//TODO: modify animation so that it applies to all markers and not just the last one in the array
 function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
      var mark = markers[i];
      var toggleBounce = function toggleBounce() {

        if (mark.getAnimation() != null) {
          mark.setAnimation(null);
        } else {
          mark.setAnimation(google.maps.Animation.BOUNCE);
        }
      };
      
      mark.setMap(map);
      google.maps.event.addListener(mark, 'click', toggleBounce);
      google.maps.event.addListener(mark, 'click', (function(markcopy) {
        
          return function() {
          infowindow.setContent('<h3>' + markcopy.title + '</h3>');
          infowindow.open(map, this);
        };
   
    })(mark));
  }
}
// Shows any markers currently in the markers array.
function showMarkers() {
  setAllMap(map);
}
//takes markers off the map but keeps them in the markers array
function clearMarkers() {
  setAllMap(null);
}
//takes markers out of the array/off of the map
function deleteMarkers() {
  clearMarkers();
  markers = [];
}
//makes markers bounce up and down..invoked when clicked
function toggleBounce() {

  if (marker.getAnimation() != null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}
//an array of people and their coordinates that will go on the map
var Folks = [ new Person("Tony R - ", "HS/Computers", 13.665189, 100.664765),
 new Person("Allan J - ", "MS/Math", 13.665308, 100.664416)
];

var mapViewModel = function () {
	var self = this;
  //populate the below array with the people from the "Folks" array
  self.people = ko.observableArray(Folks.slice(0));
  //the below is bound to the input markup
    self.filter = ko.observable('');
 //temporary array used to house people/places from search input and then repopulate the self.people array
    self.temp = ko.observableArray()
  
  //adds markers to map by looping through the observable array of self.people
  self.personMarkers = function() {
    for (var i = 0; i < self.people().length; i++) {
      addMarker(self.people()[i].lat(), self.people()[i].long(), self.people()[i].nameTitle());
    };
    showMarkers();
  };
  self.personMarkers();

  self.search = function () {
      var filter = self.filter();
        deleteMarkers();
        self.people.removeAll();
     
        for (var i = 0; i < Folks.length; i++) {
          if (Folks[i].name().toLowerCase().indexOf(filter.toLowerCase()) >= 0 ) {
                self.temp().push(Folks[i]);
                
          };
        };
        self.people(self.temp());
        self.personMarkers();
      
  };



  
  
};

ko.applyBindings(new mapViewModel());

