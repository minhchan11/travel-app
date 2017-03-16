// var apiYelpKey = require.("./../.env").apiYelpKey;
var apiHereKey = require("./../.env").apiHereKey;
var apiHereSecret = require("./../.env").apiHereSecret;
var lat = "";
var long = "";
function Travel(){
  this.place = ""
}


Travel.prototype.getExchange = function (destinationCurrency) {
    //Utilize http://fixer.io/ for currencies
    $.get('http://api.fixer.io/latest?base=USD&symbols=' + destinationCurrency
).then(function(response) {
    console.log(response);
}).fail(function(error) {
  console.log("error");
});
};

Travel.prototype.getCurrencyCode = function(country) {
  $.get('https://restcountries.eu/rest/v2/alpha/'+country
).then(function(response) {
  $('#currency').val(response.currencies[0].code)
}).fail(function(error) {
console.log("error");
});
};

Travel.prototype.getCoordinate = function () {

  $.get('https://geocoder.cit.api.here.com/6.2/geocode.json?searchtext=' + this.place + '&app_id=' + apiHereKey + '&app_code=' + apiHereSecret + '&gen=8' ).then(function(response) {
    $("input#lat").val(response.Response.View[0].Result[0].Location.DisplayPosition.Latitude);
    $("input#long").val(response.Response.View[0].Result[0].Location.DisplayPosition.Longitude);
    $('#country').val((response.Response.View[0].Result[0].Location.Address.Country).toLowerCase());
    console.log(response);
  })
  .fail(function(error) {
    console.log("error");
  });
};

Travel.prototype.getAttractions = function (lat, long) {
  $.get('https://places.demo.api.here.com/places/v1/discover/here?at=' + lat + '%2C' + long + '&app_id=' + apiHereKey + '&app_code=' + apiHereSecret)
  .then(function(response) {
    console.log(response);
    var attractions = response.results.items;
    attractions.forEach(function(item){
      $('#attractions').append('<li>' + item.title + '</li>');
    });

  })
  .fail(function(error) {
    console.log("error");
  });
};

Travel.prototype.getLocalRestaurants = function () {
  var auth = {
    consumerKey : "anMgBm3JJIbvpmjosHZluQ",
    consumerSecret : "dCgwZQoLQH5eDtj4sHw1WeFgxMo",
    accessToken : "Fv4w2x2W0qA420dCjpUfGnOLQmWT0x3V",
    accessTokenSecret : "sDQFwzxgTjtT5OtLGWcFOdsQ2Hk",
    serviceProvider : {
      signatureMethod : "HMAC-SHA1"
    }
  };

  var terms = 'food';
  var near = this.place;
  var limit = "10";
  var radius = "5000";

  var accessor = {
    consumerSecret : auth.consumerSecret,
    tokenSecret : auth.accessTokenSecret
  };

  var parameters = [];
  parameters.push(['term', terms]);
  parameters.push(['location', near]);
  parameters.push(['limit', limit]);
  parameters.push(['radius_filter', radius]);
  parameters.push(['callback', 'cb']);
  parameters.push(['oauth_consumer_key', auth.consumerKey]);
  parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  parameters.push(['oauth_token', auth.accessToken]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  var message = {
    'action' : 'https://api.yelp.com/v2/search',
    'method' : 'GET',
    'parameters' : parameters
  };

  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);

  var parameterMap = OAuth.getParameterMap(message.parameters);

  $.ajax({
    'url' : message.action,
    'data' : parameterMap,
    'dataType' : 'jsonp',
    'cache': true
  })
  .done(function(data, textStatus, jqXHR) {
    console.log('success[' + data + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');

    var restaurants = jqXHR.responseJSON.businesses
    restaurants.forEach(function(item){
      $("#restaurant").append("<li>" + "<img src="+ item.image_url + ">" + "<br>" +"<a href=" + item.url + ">" + item.name + "</a>" + "<br>" + "<p>" + "Rating: " + item.rating + "&#9733" + "</p>" + "</li>" );
    });

  }
  )
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log('error[' + errorThrown + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');
  }
  );
};
Travel.prototype.getLocalHotels = function () {
  var auth = {
    consumerKey : "anMgBm3JJIbvpmjosHZluQ",
    consumerSecret : "dCgwZQoLQH5eDtj4sHw1WeFgxMo",
    accessToken : "Fv4w2x2W0qA420dCjpUfGnOLQmWT0x3V",
    accessTokenSecret : "sDQFwzxgTjtT5OtLGWcFOdsQ2Hk",
    serviceProvider : {
      signatureMethod : "HMAC-SHA1"
    }
  };

  var terms = 'hotel';
  var near = this.place;
  var limit = "10";
  var radius = "5000";

  var accessor = {
    consumerSecret : auth.consumerSecret,
    tokenSecret : auth.accessTokenSecret
  };

  var parameters = [];
  parameters.push(['term', terms]);
  parameters.push(['location', near]);
  parameters.push(['limit', limit]);
  parameters.push(['radius_filter', radius]);
  parameters.push(['callback', 'cb']);
  parameters.push(['oauth_consumer_key', auth.consumerKey]);
  parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  parameters.push(['oauth_token', auth.accessToken]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  var message = {
    'action' : 'https://api.yelp.com/v2/search',
    'method' : 'GET',
    'parameters' : parameters
  };

  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);

  var parameterMap = OAuth.getParameterMap(message.parameters);

  $.ajax({
    'url' : message.action,
    'data' : parameterMap,
    'dataType' : 'jsonp',
    'cache': true
  })
  .done(function(data, textStatus, jqXHR) {
    console.log('success[' + data + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');

    var hotels = jqXHR.responseJSON.businesses
    hotels.forEach(function(item){
      $("#hotel").append("<li>" + "<img src="+ item.image_url + ">" + "<br>" +"<a href=" + item.url + ">" + item.name + "</a>" + "<br>" + "<p>" + "Rating: " + item.rating + "&#9733" + "</p>" + "</li>" );
    });

  }
  )
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log('error[' + errorThrown + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');
  }
  );
};

Travel.prototype.getInfo = function () {
  $.ajax({
    url: "https://en.wikipedia.org/w/api.php",
    data: {
        format: "json",
        action: "parse",
        page: this.place ,
        prop:"text",
        section:0,
    },
    dataType: 'jsonp',
    headers: {
        'Api-User-Agent': 'MyCoolTool/1.1 (http://example.com/MyCoolTool/; MyCoolTool@example.com) BasedOnSuperLib/1.4'
    },
    success: function (data) {
        var markup = data.parse.text["*"];
		var i = $('<div></div>').html(markup);
		// remove links as they will not work
		i.find('a').each(function() { $(this).replaceWith($(this).html()); });
		// remove any references
		i.find('sup').remove();
		// remove cite error
		i.find('.mw-ext-cite-error').remove();
		$('#info').html($(i).find('p').has('b'));
    }
});
};

exports.travelObject = Travel;
