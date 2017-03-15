var Travel = require('./../js/travel.js').travelObject;

$(document).ready(function(){
  var newTravel = new Travel();
  $("#customer").submit(function(event) {
    event.preventDefault();
    newTravel.place = $("#destination").val();
    newTravel.getInfo();
  })
});
