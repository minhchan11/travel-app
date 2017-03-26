// var apiYelpKey = require.("./../.env").apiYelpKey;
var apiHereKey = require("./../.env").apiHereKey;
var apiHereSecret = require("./../.env").apiHereSecret;
var apiWeatherKey = require("./../.env").apiWeatherKey;
var currencyKey = require("./../.env").currencyKey;
function Travel(){
  this.place = "";
}


Travel.prototype.getWeather = function () {
    //Utilize http://fixer.io/ for currencies
    $.get('http://api.openweathermap.org/data/2.5/forecast?q=' + this.place + '&appid=' + apiWeatherKey
).then(function(response) {
  var forecast = response.list;
  var chosen = [6, 14, 22, 30, 38];
  for (var j = 0; j < chosen.length; j++) {
    var getDate = forecast[chosen[j]].dt_txt.toString().slice(0,10);
    var toFarenheit = (parseFloat(forecast[chosen[j]].main.temp_min)*9/5-460).toFixed(2);
    $("#weather").append("<div class='col-md-2'>"+"<div class='panel panel-default'>" + "<div class='panel-heading'>" + "Date: "  + getDate + "</div>" + "<div class='panel-body'>" + " Temperature: "+ toFarenheit + "<br>" + "Forecast: " + forecast[chosen[j]].weather[0].main + "</div>" + "</div>" + "</div>");
}
}).fail(function(error) {
  console.log("error");
});
};

Travel.prototype.getExchange = function (foreign, budget) {
$.get('http://apilayer.net/api/live?access_key=' + currencyKey + '&currencies=USD,'+ foreign +'&format=1'
).then(function(response) {
  var temp = response.quotes;
  var rate = temp[Object.keys(temp)[1]];
  console.log(budget);
  console.log(rate * budget);
  $("#rate").text(rate.toString());
  $("#convert").text(parseFloat(rate * budget).toFixed(2));
}).fail(function(error) {
  console.log("error");
});
};

Travel.prototype.getCurrencyCode = function(country) {
  $.get('https://restcountries.eu/rest/v2/alpha/'+country
).then(function(response) {
  console.log(response);
  currency = response.currencies[0].code;
  $('#currency').text(response.currencies[0].code);
}).fail(function(error) {
console.log("error");
});
};

Travel.prototype.getCoordinate = function () {
  var position = [];
  $.get('https://geocoder.cit.api.here.com/6.2/geocode.json?searchtext=' + this.place + '&app_id=' + apiHereKey + '&app_code=' + apiHereSecret + '&gen=8' ).then(function(response) {
    position.push(response.Response.View[0].Result[0].Location.DisplayPosition.Latitude);
    position.push(response.Response.View[0].Result[0].Location.DisplayPosition.Longitude);
    position.push((response.Response.View[0].Result[0].Location.Address.Country).toLowerCase());
    console.log(response);
  })
  .fail(function(error) {
    console.log("error");
  });
  return position;
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

// Travel.prototype.getAirport = function () {
//   $.get('https://places.demo.api.here.com/places/v1/discover/explore?at=52.5159%2C13.3777&cat=airport&app_id=DemoAppId01082013GAL&app_code=AJKnXv84fjrb0KIHawS0Tg)
//   .then(function(response) {
//     console.log(response);
//     var attractions = response.results.items;
//     attractions.forEach(function(item){
//       $('#attractions').append('<li>' + item.title + '</li>');
//     });
//
//   })
//   .fail(function(error) {
//     console.log("error");
//   });
// };

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
    // console.log('success[' + data + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');

    var restaurants = jqXHR.responseJSON.businesses;
    restaurants.forEach(function(item){
      $("#restaurant").append("<div class='col-md-1 newRes'>" + "<img class='pics' src="+ item.image_url + ">" + "<br>" +"<a href=" + item.url + ">" + item.name + "</a>" + "<br>" + "<p>" + item.rating + "&#9733" + "</p>" + "</div>" );
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
    // console.log('success[' + data + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');

    var hotels = jqXHR.responseJSON.businesses;
    hotels.forEach(function(item){
      $("#hotel").append("<div class='col-md-1 newHotel'>" + "<img class='pics' src="+ item.image_url + ">" + "<br>" +"<a href=" + item.url + ">" + item.name + "</a>" + "<br>" + "<p>" + item.rating + "&#9733" + "</p>" + "</div>" );
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
		$('#info-picture').html($(i).find('img').first());
    }
});
};

exports.travelObject = Travel;
