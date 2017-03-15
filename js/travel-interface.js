var Travel = require('./../js/travel.js').travelObject;
var newLat = "";
var newLong = "";
$(document).ready(function(){
  var newTravel = new Travel();
  $("#customer").submit(function(event) {
    event.preventDefault();
    newTravel.place = $("#destination").val();
    newTravel.getInfo();
    newTravel.getCoordinate();
    setTimeout(function(){
      newLat = $("input#lat").val();
      newLong = $("input#long").val();
      if(newLat != "" && newLong != ""){
      newTravel.getAttractions(newLat, newLong);
    }; }, 500);
  })
});
