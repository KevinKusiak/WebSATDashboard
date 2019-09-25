
var refreshIcon = "<i class='fa fa-refresh fa-spin text-gray'></i>";
var map1, map2, heatmap;
var Schaumburg_location = new google.maps.LatLng('42.033360', '-88.083405');
var markerCluster;
var markers = [];
var heatpoints = [];
var markerClusterer;

var satArray = [];
var filteredSatArray = [];

//When the page loads and is ready, this function gets called
$(document).ready(function () {

    satArray = sat_scores.sats; // data from the JSON data file data/sat_scores.js

    refreshScores()
});

//Function that loads the data from the JSON array based on the range filter selection
function refreshScores() {
    var range = $("#rangeList").val();
    var satObject;

    filteredSatArray = []; 
        
    if (range == "low") {  // < 800
        for (var i = 0; i < satArray.length; i++) {
            satObject = satArray[i];

            if (satObject.Total_Score <= 800) {
                filteredSatArray.push(satObject);               
            }
        }
    }
    if (range == "medium") {  // > 800 and < 1000
        for (var i = 0; i < satArray.length; i++) {
            satObject = satArray[i];

            if ((satObject.Total_Score > 800) && (satObject.Total_Score <= 1000)) {
                filteredSatArray.push(satObject);
            }
        }
    }

    if (range == "high") {  // > 1000
        for (var i = 0; i < satArray.length; i++) {
            satObject = satArray[i];

            if (satObject.Total_Score > 1000) {
                filteredSatArray.push(satObject);
            }
        }
    }

    showClusterMap();   
 }

//Sets the options for the cluster map and initializes it
//At the same time, it calls createMarkers() to create the actual markers based on the filtered data
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
  
    createMarkers();
}

//Sets the options for the heat map and initializes it
//All the points on the map are coming from the createMarkers() function 
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
        data: heatpoints,
        map: map2,
        radius: 25
    });
}

//Creates the markers based on the filtered data
//These markers are used by the clustered map and the heat zone map
function createMarkers() {
    markers = [];
    heatpoints = [];

     if (markerCluster) {
            markerCluster.clearMarkers();
        }
           
    var imageUrl = 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&' + 'chco=FFFFFF,008CFF,000000&ext=.png';
    var markerImage = new google.maps.MarkerImage(imageUrl, new google.maps.Size(24, 32));
    var marker = null;
    var location, off_location;
      
    for (var i = 0; i < filteredSatArray.length; i++) {
        satObject = filteredSatArray[i];
            
        // modify lat and lng otherwise are markers will overlap 
        off_location = new google.maps.LatLng(satObject.Lat + (0.0001 * i), satObject.Lng + (0.0001 * i));
        location = new google.maps.LatLng(satObject.Lat, satObject.Lng);

        heatpoints.push(location);
            
        var toolTip = "School: " + satObject.School + " - SAT Score: " + satObject.Total_Score;
            
        // create a single marker
        marker = new google.maps.Marker({
            'position': off_location,
            'title': toolTip,
            'icon': markerImage,
            'isopen': false                
        });
            
        markers.push(marker);
    }
                  
    var mapOptions = { gridSize: 50, maxZoom: 13 };

    // Add a marker clusterer to manage the markers
    markerCluster = new MarkerClusterer(map1, markers, mapOptions);
        
    showHeatMap();

}