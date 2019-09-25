var map1, map2, heatmap;
var Schaumburg_location = new google.maps.LatLng('42.033360', '-88.083405');
var Conant_location = new google.maps.LatLng();
var Hoffman_location = new google.maps.LatLng();
var Palatine_location = new google.maps.LatLng();
var Fremd_location = new google.maps.LatLng();
var markerCluster;
var markers = [];
var heatpoints = [];
var markerClusterer;


//Onload function that is called when the page is loaded
$(document).ready(function () {
    showClusterMap();
    showHeatMap();
});

function showClusterMap() {

    // set map options
    var mapOptions = {
        zoom: 11,
        center: Schaumburg_location,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false
    }

    // initialize the map
    map1 = new google.maps.Map(document.getElementById("mapCluster"), mapOptions);

  
    var location;
    var marker;

     //Location setting for CHS

    location = new google.maps.LatLng('42.0363212', '-88.0619521'); // CHS
     marker = new google.maps.Marker({
        position: location,
        map: map1,
        title: 'CHS'
     });
    
     markers.push(location)

         //Location setting for FHS

     location = new google.maps.LatLng('42.0949186', '-88.0675972'); // FHS
     marker = new google.maps.Marker({
         position: location,
         map: map1,
         title: 'FHS'
     });

     markers.push(location)

     //Location setting for HEHS

     location = new google.maps.LatLng('42.0533467', '-88.1100414');  // HEHS
     marker = new google.maps.Marker({
         position: location,
         map: map1,
         title: 'HEHS'
     });

     markers.push(location)

     //Location setting for PHS

     location = new google.maps.LatLng('42.1324081', '-88.0247114');  // PHS
     marker = new google.maps.Marker({
         position: location,
         map: map1,
         title: 'PHS'
     });

     markers.push(location)

     //Location setting for SHS
     location = new google.maps.LatLng('42.027448', '-88.1068554');  // SHS
     marker = new google.maps.Marker({
         position: location,
         map: map1,
         title: 'SHS'
     });

     markers.push(location)
    

     showHeatMap();
}

function showHeatMap() {

    // set map options
    var mapOptions = {
        zoom: 12,
        center: Schaumburg_location,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false
    }

    //initialize the map
    map2 = new google.maps.Map(document.getElementById("mapHeat"), mapOptions);
         
    // initialize the heat layer
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: markers,
        map: map2,
        radius: 25
    });
}



