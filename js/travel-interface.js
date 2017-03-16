var Travel = require('./../js/travel.js').travelObject;
var newLat = "";
var newLong = "";
$(document).ready(function(){
  var newTravel = new Travel();


  $("#customer").submit(function(event) {
    event.preventDefault();
    $("#attractions").text("");
    $("#hide").removeClass("hidden");
    $("#hotel").text("");
    $("#restaurant").text("");
    $("#rate").text("");
    $("#convert").text("");
    $("#weather").text("");
    newTravel.place = $("#destination").val().replace(" ","_");
    var newBudget = parseFloat($("#budget").val());
    newTravel.getInfo();
    newTravel.getCoordinate();
    newTravel.getLocalRestaurants();
    newTravel.getLocalHotels();
    newTravel.getWeather();
    setTimeout(function(){
      newLat = $("input#lat").val();
      newLong = $("input#long").val();
      newTravel.getAttractions(newLat, newLong);
  }, 5);
    setTimeout(function(){
      var country = $("input#country").val();
      newTravel.getCurrencyCode(country);
  }, 10);
    setTimeout(function(){
      var currency = $("#currency").val();
      console.log(currency);
      if(currency != "USD"){
      newTravel.getExchange(currency, newBudget);
    }
  }, 50);


  })
});
