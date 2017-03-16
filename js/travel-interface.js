var Travel = require('./../js/travel.js').travelObject;
var newLat = "";
var newLong = "";
$(document).ready(function(){
  var newTravel = new Travel();
  $("#destination").autocomplete({
      source: function(request, response) {
          $.ajax({
              url: "http://en.wikipedia.org/w/api.php",
              dataType: "jsonp",
              data: {
                  'action': "opensearch",
                  'format': "json",
                  'search': request.term
              },
              success: function(data) {
                  response(data[1]);
              }
          });
      }
  });
  $("#customer").submit(function(event) {
    event.preventDefault();
    newTravel.place = $("#destination").val().replace(" ","_");
    newTravel.getInfo();
    newTravel.getCoordinate();

    setTimeout(function(){
      newLat = $("input#lat").val();
      newLong = $("input#long").val();
      newTravel.getAttractions(newLat, newLong);
  }, 5);

  })
});
