var Travel = require('./../js/travel.js').travelObject;
var newLat = "";
var newLong = "";
$(document).ready(function(){
  var newTravel = new Travel();


  $("#customer").submit(function(event) {
    event.preventDefault();
    $("#attractions").text("");
    $("#hotel").text("");
    $("#restaurant").text("");
    newTravel.place = $("#destination").val().replace(" ","_");
    newTravel.getInfo();
    newTravel.getCoordinate();
    newTravel.getLocalRestaurants();
    newTravel.getLocalHotels();
    setTimeout(function(){
      newLat = $("input#lat").val();
      newLong = $("input#long").val();
      newTravel.getAttractions(newLat, newLong);
  }, 100);
    setTimeout(function(){
      var country = $("input#country").val();
      newTravel.getCurrencyCode(country);
  }, 200);
    setTimeout(function(){
      var currency = $("#currency").val();
      newTravel.getExchange();
  }, 500);


  })
});
