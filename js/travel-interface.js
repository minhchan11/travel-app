var Travel = require('./../js/travel.js').travelObject;
$(document).ready(function(){
  var newTravel = new Travel();
  $("#customer").submit(function(event) {
    event.preventDefault();
    $("#hide").removeClass("hidden");
    $('span[class=details]').text("");
    $("#weather").text("");
    newTravel.place = $("#destination").val().replace(" ","_").toLowerCase();
    newTravel.getInfo();
    var newPosition = newTravel.getCoordinate();
    newTravel.getLocalRestaurants();
    newTravel.getLocalHotels();
    newTravel.getWeather();
    setTimeout(function(){
      newTravel.getAttractions(newPosition[0], newPosition[1]);}, 50);
    setTimeout(function(){ newTravel.getCurrencyCode(newPosition[2]);}, 50);
    var newBudget = parseFloat($("#budget").val());
    setTimeout(function(){
      if($("#currency").text() !== "USD"){
        $("#budgetConvert").removeClass("hidden");
      newTravel.getExchange($("#currency").text(), newBudget);
    }
  }, 100);


  })
});
