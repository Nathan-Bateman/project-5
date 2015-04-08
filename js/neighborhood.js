var defMapOptions = {
  zoom: 16,
  center: new google.maps.LatLng(13.66448,100.66160)
}
var map = new google.maps.Map(document.getElementById('map-canvas'), defMapOptions);
function initialize() {
  var myLatlng = defMapOptions.center;
  var mapOptions = defMapOptions;
  
  //var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

 /*   var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Bang Na Vill Ahhh!'
  });
  */
}
 google.maps.event.addDomListener(window, 'load', initialize);
 



var Person = function (name, title, lat, long) {
 this.name = ko.observable(name);
 this.title = ko.observable(title);
 this.lat = ko.observable(lat);
 this.long = ko.observable(long);
 this.nameTitle = ko.computed(function() {
 return this.name() + " " + this.title();
 }, this);


 }

var addMarker = function (lat, long, title) {
  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat,long),
    map: map,
    title: title

  });
 }

var Folks = [ new Person("Tony R - ", "HS/Computers", 13.665189, 100.664765),
 new Person("Allan J - ", "MS/Math", 13.665308, 100.664416)
];

var mapViewModel = function () {
	var self = this;
  self.people = ko.observableArray(Folks);
  self.filter = ko.observable("");
  self.search = function (value){
        self.people.removeAll();
        for (var i = 0; i < Folks.length; i++) {
          if (self.people()[i].name().toLowerCase().indexOf(value.toLowerCase()) >=0 ) {

                

          };
        };
  };


  self.personMarkers = function() {
    for (var i = 0; i < self.people().length; i++) {
    new addMarker(self.people()[i].lat(), self.people()[i].long(), self.people()[i].nameTitle());
    };
  };

  self.personMarkers();
};
ko.applyBindings(new mapViewModel());
