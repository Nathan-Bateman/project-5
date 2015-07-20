var $body = $('body');
var $mapDiv = $('#map-canvas');
var $myModal = $('#myModal');
online = window.navigator.onLine;
window.addEventListener("offline", function(e) {alert("please check your connection");})

window.addEventListener("online", function(e) {alert("connection restored!");})

//make cursor appear in search bar automatically
var setFocus = function() {
  var input = document.getElementById ("theFieldID");
  input.focus ();
  };
setFocus();
//list of places with their foursquare IDs
var venues = {
  foodland: '4b45bb48f964a520aa0f26e3',
  central: '4b529cbdf964a520e28327e3',
  mega:'4f98ca42e4b028100302dbde',
  paradise:'4ba5c57cf964a520482139e3',
  seacon:'4bb9a4a198c7ef3b61373202',
  dusit:'4bc402c8f8219c7411eab610',
  yellow:'4c9ec48203133704338e6cd5',
  lotus:'4bf90dc7508c0f476c0b3f31',
  bigc:'4e33b40be4cdf7a42ca9cd33',
  kingPark:'4b6d7a63f964a52025772ce3',
  mackro:'4b6f9cb5f964a520e1f72ce3',
  thainakarin:'4e0abe0718a889c5fe8dee2b',
  sikarin:'4b6526aff964a52081e62ae3',
  samitivejsuk:'4b0d43fff964a520684523e3',
  samitivejsrin:'4b5d7d44f964a520b15e29e3',
  bumrungrad:'4b6a2465f964a520f6c92be3',
  suvarnabumi:'4af833a6f964a5205a0b22e3',
  donmuang:'4b2df07cf964a5201bdc24e3',
  ics:'4b975803f964a5204c0035e3'
};
//parameters for initial map load
var defMapOptions = {
  zoom: 10,
  center: new google.maps.LatLng(13.828746,100.571594)
};
var map = new google.maps.Map(document.getElementById('map-canvas'), defMapOptions);

var initialize = function initialize() {
  var myLatlng = defMapOptions.center;
  var mapOptions = defMapOptions;
};

google.maps.event.addDomListener(window, 'load', initialize);
//default content for info windows
var content = document.createElement("DIV");
// variable that is the one and only info window of the page..content changes upon a click event
var infowindow = new google.maps.InfoWindow({
  content: content,
  maxWidth: 200
});

//put all markers on map 
var setAllMap = function setAllMap(map) {
  
  for (var i = 0; i < markers.length; i++) {
      var mark = markers[i];
      mark.setMap(map);
  }
};
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
 
// function to add places to map including creating their markers with infoWindows and event listeners
var Place = function (name, title, lat, long, img, url) {
 this.name = ko.observable(name);
 this.title = ko.observable(title);
 this.lat = ko.observable(lat);
 this.long = ko.observable(long);
 this.img = ko.observable(img);
 this.url = ko.observable(url);
 this.nameTitle = ko.computed(function() {
 return this.name() + " " + this.title();
 }, this);
 this.htmlImg = ko.computed(function() {
  return '<h4>'+ this.name() + this.title() + '</h4>' + '<img src=' + this.img() +
    '>' + '<br>' + '<a href="' + this.url() + '">Visit Site' + '</a><br>';
 }, this);

 this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat,long),
    map: map,
    title: title,
    content: this.htmlImg()

  });
//listener to add the information window to each marker
 google.maps.event.addListener(this.marker, 'click', function() {
          infowindow.setContent('<h4>'+ name + title + '</h4>' + '<img src=' + img +
              '>' + '<br>' + '<a href="' + url + '">Visit Site' + '</a><br>');
          infowindow.open(map, this);
  });
//listener to add the bounce animation to each marker..each marker bounces 2-3 times and then stops
 google.maps.event.addListener(this.marker, 'click', (function(markcopy) {
          return function() {  
              if (markcopy.getAnimation() !== null) {
                  markcopy.setAnimation(null);
                } else {
          markcopy.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){ markcopy.setAnimation(null); }, 1500);

        }
        map.setCenter(markcopy.getPosition());
      };
    })(this.marker));
//listener to stop the bounce animation upon closing the information window
 google.maps.event.addListener(infowindow, 'closeclick', (function(markcopy) {
        
          return function() {
          markcopy.setAnimation(null);
        };
   
    })(this.marker));
 };

 //empty array to hold markers
 var markers = [];

//an array of places/people and their coordinates that will go on the map
var locations = [ new Place("Tony R - ", "HS/Computers", 13.665189, 100.664765, "images/tony.jpg", 'http://ics.ac.th/'),
              new Place("Allan J - ", "MS/Math", 13.665308, 100.664416, "images/allen.jpg",'http://ics.ac.th/')
];

var mapViewModel = function () {
  var self = this;

  //function to add a marker to the markers array
  var addMarker = function () {
    for (var i = 0; i < self.places().length; i++) {
      markers.push(self.places()[i].marker)
    }; 
 }
  //observable that hides menu by default by working with KO's visible binding
  self.showMenu = ko.observable(false);
  //jQuery's toggle function to switch list view on and off depending on user behavior
  self.toggleMenu = function () {
    $( ".BV-folks" ).toggle('fast');
  };
  //function containing ajax call to foursquare server as well as other functions related to the data to
  //be retrieved fromt he server
  var loadData = function (){
    
    //empty observable array for all places on the map
    self.places = ko.observableArray();
    //adds markers to map by looping through the observable array of self.places
    self.placeMarkers = function() {
      for (var i = 0; i < self.places().length; i++) {
        /*addMarker(self.places()[i].lat(), self.places()[i].long(), self.places()[i].nameTitle(), self.places()[i].htmlImg());*/
        addMarker();
        }
      showMarkers();
    };
    //iterates through the key values in the venues object to collect data from foursquare
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
            var venue = response.response.venue;
            var name = venue.name;
            var lat = venue.location.lat;
            var lng = venue.location.lng;
            var photo;
            // Change the image to a missing image

            if (typeof venue.photos.groups[0] === 'undefined') {
              photo = "images/photounavailable.png";
            } else {
              var photopre = venue.photos.groups[0].items[1].prefix;
              var photosuf = venue.photos.groups[0].items[1].suffix; 
              photo = photopre + 125 + photosuf;
            }

            if (typeof venue.url === 'undefined') {
                    switch (name) {
                        case "Thainakarin| Medicine Center":
                          url = 'http://www.thainakarin.co.th/en/index.php';
                          break;
                        case 'โรงพยาบาลศิครินทร์ (Sikarin Hospital)':
                          url = 'http://www.sikarin.com/en';
                          break;
                        case 'โรงพยาบาลสมิติเวช สุขุมวิท (Samitivej Sukhumvit Hospital)':
                          url = 'http://www.samitivejhospitals.com/sukhumvit/';
                          break;
                        case 'โรงพยาบาลสมิติเวช ศรีนครินทร์ (Samitivej Srinakarin Hospital)':
                          url = 'http://www.samitivejhospitals.com/srinakarin/';
                          break;
                        case 'Bumrungrad International Clinic Building':
                          url = 'https://www.bumrungrad.com/thailandhospital';
                          break;
                        case 'International Community School (ICS) (โรงเรียนประชาคมนานาชาติ)':
                          url = 'http://ics.ac.th/';
                          break;

              }
            } else {
                    url = venue.url;
            }
            //html for the information window
            var content = '<h5>' +
                          name + '</h5>' +
                          '<img src=' +
                          photo +
                          '>' +
                          '<br>' +
                          '<a class=' +
                          'website' + 
                          'href="' +
                          url +
                          '">Visit Site' +
                          '</a><br>';
            locations.push(new Place(name, "", lat, lng, photo, url));
            //populate the below array with the places from the "locations" array
            self.places(locations.slice(0));
            //places all markers on the page
            self.placeMarkers();
            //below handles the error incase of a failed call
          },
          error: function (){
            $myModal.modal('show');
          }
      });

    }
  
  };
//calls the function "loadData" which contains the ajax call
loadData();
  
    //the below is bound to the input markup for the content the user types into the search bar
    self.filter = ko.observable('');
    //temporary array used to house places from search input and then repopulate the self.places array
    self.temp = ko.observableArray();

  //filters the list view and displays only the markers that match the search query or the error message if 
  //nothing matches
  self.search = function () {
    map.setCenter({lat: 13.828746, lng: 100.571594});
    infowindow.close();
      var filter = self.filter();
        deleteMarkers();
        self.places.removeAll();
      var len = locations.length;
        for (var i = 0; i < len; i++) {
          if ((locations)[i].nameTitle().toLowerCase().indexOf(filter.toLowerCase()) >= 0 ) {
                self.temp().push(locations[i]);    
              }
            }
            if (self.temp().length === 0) {
              self.places.push(new Place('No items match your search', "", '', '', '', ''));
            }
      self.places(self.temp());
      self.placeMarkers();
      
  };

//causes info marker to act as if it's been clicked when the corresponding list item is clicked
self.listClick = function(place) {
  var mark = place.marker;
  google.maps.event.trigger(mark,"click");
};  
};

ko.applyBindings(new mapViewModel());
