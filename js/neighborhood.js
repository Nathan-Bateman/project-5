var defMapOptions = {
  zoom: 16,
  center: new google.maps.LatLng(13.66448,100.66160)
}
function initialize() {
  var myLatlng = new google.maps.LatLng(13.66448,100.66160);
  var mapOptions = {
    zoom: 16,
    center: myLatlng
  }
  
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Bang Na Vill Ahhh!'
  });
 
}
 google.maps.event.addDomListener(window, 'load', initialize);
 



var Person = function (name, title, yearshere, lat, long) {
 this.name = ko.observable(name);
 this.title = ko.observable(title);
 this.yearshere = ko.observable(yearshere);
 this.lat = ko.observable(lat);
 this.long = ko.observable(long);

 }

var addMarker = function (lat, long, title) {
  var map = new google.maps.Map(document.getElementById('map-canvas'), defMapOptions);
  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat,long),
    map: map,
    title: title

  });
 }

addMarker(13.665189, 100.664765,'bill');
addMarker(13.66448, 100.66160,'bv');


var mapViewModel = function () {
	var self = this;
	self.people = ko.observableArray([
 new Person("Tony R - ", "HS Teacher - Computers", 4, 13.665189, 100.664765),
 new Person("Allan J - ", "MS Teacher - Math", 6, 13.665308, 100.664416)
 ]);

  self.markers = function() {
    for (var i = 0; i < self.people().length; i++) {
    new addMarker(self.people()[i].lat(), self.people()[i].long(), self.people()[i].title());
    };
  };
};
ko.applyBindings(new mapViewModel());