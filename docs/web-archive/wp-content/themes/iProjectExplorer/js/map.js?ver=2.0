//Script Name: iProjectExplorer map Script
//Copyright 2020 iCityWork. All rights reserved. Republication or redistribution of iCityWork software content is prohibited without the prior written consent of iCityWork.

var map;
var mapMarkers = [,];
var kmlLayer;

// lat, lng, title, pin color, icon color, icon, id, pin, kml url
function createMarker(lat,lon,title,pinColor, iconColor, icon, postid, pin, projectKMLFile){
  var pin = [Number(lat),Number(lon),title,pinColor, iconColor, mapIcons[icon], postid, pin, projectKMLFile]
  mapMarkers.push(pin);
}

function mapPin(pinColor) {
    return {
      path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
      fillColor: pinColor,
      fillOpacity: .8,
      strokeColor: '#000',
      strokeWeight: 1,
      scale: 0.6,
      labelOrigin: new google.maps.Point(0, -28),
   };
}

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: Number(map_center_lat), lng: Number(map_center_lon)},
      zoomControl: true,
      zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      streetViewControl: true,
      mapTypeControl: true,
      fullscreenControl: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DEFAULT,
        mapTypeIds: ['roadmap', 'terrain', 'satellite', 'hybrid'],
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }
    });
    map.setZoom(Number(map_default_zoom));
    var MainKMLLayer = new google.maps.KmlLayer({
      url: kml_file,
      map: map,
      suppressInfoWindows: true,
      preserveViewport: true
    });

    google.maps.event.addListenerOnce(map, 'idle', function(){
    // Load the markers after the main map is loaded.
      // lat, lng, title, pin color, icon color, icon, id, pin, kml url
      for(var i = 1; i < mapMarkers.length; i++){
        var thisMarker = mapMarkers[i];
        var lat = mapMarkers[i][0];
        var lon = mapMarkers[i][1];
        var title = mapMarkers[i][2];
        var pinColor = mapMarkers[i][3];
        var iconColor = mapMarkers[i][4];
        var icon = mapMarkers[i][5];
        var id = mapMarkers[i][6];
        var pin = mapMarkers[i][7];
        var kml = mapMarkers[i][8];

        if (pin == 'Yes'){
            doMarkers(lat, lon, title, pinColor, iconColor, icon, id);
            doPinDetailMap(lat,lon,pinColor,iconColor,icon,id);
        } else {
          {
            doKML(kml,title,id);
            doKMLDetailMap(id, kml);
          }
        }
      }
      });
  }

  function doMarkers(lat, lon, title, pinColor, iconColor, icon,id){
    marker = new google.maps.Marker({
      position: {lat: lat, lng: lon},
      map: map,
      icon: mapPin(pinColor),
      label: {
          fontFamily: 'Fontawesome',
          text: icon,
          color: iconColor,
          fontSize: '10px'
      },
      title: title,
      id: id
    });

    marker.addListener('click', function() {
      jQuery("#projectDetail" + id).modal('show');
      console.log("Icon Clicked" + id);
    });
  }

  function doKML(kml, title, id){
    var mainKMLLayer;
    mainKMLLayer = "KMLLayer" + id;
    mainKMLLayer = new google.maps.KmlLayer({
      url: kml,
      map: map,
      suppressInfoWindows: true,
      preserveViewport: true
    });
    mainKMLLayer.addListener('click', function(event) {
      jQuery("#projectDetail" + id).modal('show');
    });
  }

  function doPinDetailMap(lat,lon,pinColor,iconColor,icon,id){
    // Only create the map if the modal is opened.
    jQuery("#projectDetail"+id).on("shown.bs.modal", function () {
      var divName = "map" + id;
    	var mapName = "map" + id;

      var mapName = new google.maps.Map(document.getElementById(divName), {
            center: {lat: lat, lng: lon},
            zoom: 16,
            disableDefaultUI: true,
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.DEFAULT,
              mapTypeIds: ['roadmap', 'terrain', 'satellite', 'hybrid'],
              position: google.maps.ControlPosition.LEFT_BOTTOM
            }
          });

          marker = new google.maps.Marker({
            position: {lat: lat, lng: lon},
            map: mapName,
            icon: mapPin(pinColor),
            label: {
                fontFamily: 'Fontawesome',
                text: icon,
                color: iconColor,
                fontSize: '12px'
            }
          });
      //google.maps.event.trigger(mapName, "resize");
      mapName.setCenter(new google.maps.LatLng(lat,lon));
    });
  }

  function doKMLDetailMap(id, kml){
    // Only create the map if the modal is opened.
    jQuery("#projectDetail"+id).on("shown.bs.modal", function () {
      var divName = "map" + id;
      var mapName = "map" + id;
      kmlLayer = "Layer" + id;
      var mapName = new google.maps.Map(document.getElementById(divName), {
            disableDefaultUI: true,
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.DEFAULT,
              mapTypeIds: ['roadmap', 'terrain', 'satellite', 'hybrid'],
              position: google.maps.ControlPosition.LEFT_BOTTOM
            }
          });
      //google.maps.event.trigger(mapName, "resize");
      kmlLayer = new google.maps.KmlLayer({
        preserveViewport: false,
        suppressInfoWindows: false,
        url: kml,
        map: mapName
      });
    });
  }

 //Show Modal for the details.
 function ShowModal(e) {
 	jQuery('#projectDetail'+e.target.options.id).modal({backdrop: 'static'});
 }
