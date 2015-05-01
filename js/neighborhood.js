//TODO: fill in rest of IDs and somehow sync them into the info windows of each created marker
//must also figure out how to create venues...with or without Person function??
var venues = {
  foodland: '4b45bb48f964a520aa0f26e3',
  central: '4b529cbdf964a520e28327e3'
 /* mega:'empty',
  paradise:'empty',
  seacon:'empty',
  dusit:'empty',
  yellow:'empty',
  lotus:'empty',
  bigc:'empty',
  mackro:'empty',
  thainakarin:'empty',
  sikarin:'empty',
  samitivejsuk:'empty',
  samitivejsrin:'empty',
  bumrungrad:'empty'*/
};
var contentForInfoWindows = [];
function loadData (){
  for (var venue in venues) {
    var ID = venues[venue];
    var URL = 'https://api.foursquare.com/v2/venues/' + 
              ID + 
              '?&client_id=1ZZZKPHYYJEXJ13CLALWGP35AWD0LJFHFB3Z5DABSCFPXWVY' +
              '&client_secret=MLYWIJVO3CA2HKSQ1AUVSVLV2IQTV3X3AFCBIU0QZFC3O41C&v=20140806&m=foursquare';
  $.ajax(
      {
        url: URL,
        dataType: 'jsonp',
        success: function(response){
          var venue = response.response.venue
          var name = venue.name;
          var lat = venue.location.lat;
          var lng = venue.location.lng;
          var photopre = venue.photos.groups[0].items[1].prefix;
          var photosuf = venue.photos.groups[0].items[1].suffix;
          var photo = photopre + 175 + photosuf;
          var url = venue.url;
          var content = '<h3>'
                        + name + '</h3>'
                        + '<img src='
                        + photo
                        + '>'
                        + '<br>'
                        + '<a href="'
                        + url
                        + '">Visit Site'
                        +'</a><br>' ;
          contentForInfoWindows.push(content);
          console.log(contentForInfoWindows[0]);
        }
    });
  };
  
}

loadData();

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
var content = document.createElement("DIV");
var htmlContent = document.createElement("DIV");
content.appendChild(htmlContent)
// variable that is the one and only info window of the page..content changes upon a click event
  var infowindow = new google.maps.InfoWindow({
      content: content,
      maxWidth: 200
  });

//put all markers on map with interactive info windows that open and bounce when clicked and
//close and stop bouncing when clicked or closed
//TODO: modify animation so that when a marker is clicked..all other markers stop bouncing save the one clicked
 function setAllMap(map) {
  
  for (var i = 0; i < markers.length; i++) {
      var mark = markers[i];
      mark.setMap(map);
//listener to add the bounce animation to each marker..each marker bounces 2-3 times and then stops
      google.maps.event.addListener(mark, 'click', (function(markcopy) {
          return function() {  
              if (markcopy.getAnimation() != null) {
                  markcopy.setAnimation(null);
                } else {
          markcopy.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){ markcopy.setAnimation(null); }, 1500);

        }
      };
    })(mark));
//listener to add the information window to each marker
      google.maps.event.addListener(mark, 'click', (function(markcopy) {
        
          return function() {
          infowindow.setContent('<h3>' + markcopy.title + '</h3>');
          infowindow.open(map, this);
        };
   
    })(mark));
//listener to stop the bounce animation upon closing the information window
      google.maps.event.addListener(infowindow, 'closeclick', (function(markcopy) {
        
          return function() {
          markcopy.setAnimation(null);
        };
   
    })(mark));

  }
};
// Shows any markers currently in the markers array.
function showMarkers() {
  setAllMap(map);
};
//takes markers off the map but keeps them in the markers array
function clearMarkers() {
  setAllMap(null);
};
//takes markers out of the array/off of the map
function deleteMarkers() {
  clearMarkers();
  markers = [];
};
 
// function to add people to map
var Person = function (name, title, lat, long) {
 this.name = ko.observable(name);
 this.title = ko.observable(title);
 this.lat = ko.observable(lat);
 this.long = ko.observable(long);
 this.nameTitle = ko.computed(function() {
 return this.name() + " " + this.title();
 }, this);
 };
 //empty array to hold markers
 var markers = [];
//function to add a marker to the markers array
var addMarker = function (lat, long, title, html) {
    this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat,long),
    map: map,
    title: title,
    content:''

  });
    
    markers.push(this.marker);
 };
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
//filters the list view and displays only the markers that match the search query
  self.search = function () {
      var filter = self.filter();
        deleteMarkers();
        self.people.removeAll();
     
        for (var i = 0; i < Folks.length; i++) {
          if (Folks[i].nameTitle().toLowerCase().indexOf(filter.toLowerCase()) >= 0 ) {
                self.temp().push(Folks[i]);    
              };
            };
      self.people(self.temp());
      self.personMarkers();
      
  };

//causes info marker to act as if it's been clicked when the corresponding list item is clicked
self.listClick = function(place) {
  for (var i = 0; i < markers.length; i++) {
        var mark = markers[i];
      if (mark.title === place.nameTitle()) {
          google.maps.event.trigger(mark,"click");
        };
    }
};


  
  
};

ko.applyBindings(new mapViewModel());

