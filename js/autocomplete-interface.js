$(document).ready(function(){
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
});
