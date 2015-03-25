/*function initialize() {
	var mapOptions = {
          center: { lat: 13.66448, lng: 100.66160},
          zoom: 16
        };
    var latLong = new google.maps.LatLng(13.66448,100.66160);
    var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
      };
    var marker = new google.maps.Marker({
      		position: latLong,
      		map: map,
      		title: 'Hello World!'
  });


      google.maps.event.addDomListener(window, 'load', initialize);
*/
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
      title: 'Hello World!'
  });
}

google.maps.event.addDomListener(window, 'load', initialize);

function Person (name, title, yearshere) {
 this.name = ko.observable(name);
 this.title = ko.observable(title);
 this.yearshere = ko.observable(yearshere);

 }

function mapViewModel() {
	var self = this;
	self.people = ko.observableArray([
 new Person("Tony", "HS Teacher - Computers", 4),
 new Person("Allan J", "MS Teacher - Math", 6)
 ]);



};
ko.applyBindings(new mapViewModel());