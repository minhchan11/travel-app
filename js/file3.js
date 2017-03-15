// function cb(data) {
//   console.log("cb: " + JSON.stringify(data));
// }

var auth = {
  //
  // Update with your auth tokens.
  //
  consumerKey : "anMgBm3JJIbvpmjosHZluQ",
  consumerSecret : "dCgwZQoLQH5eDtj4sHw1WeFgxMo",
  accessToken : "Fv4w2x2W0qA420dCjpUfGnOLQmWT0x3V",
  // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
  // You wouldn't actually want to expose your access token secret like this in a real application.
  accessTokenSecret : "sDQFwzxgTjtT5OtLGWcFOdsQ2Hk",
  serviceProvider : {
    signatureMethod : "HMAC-SHA1"
  }
};

var terms = 'food';
var near = 'San+Francisco';
var categories = 'pizza';
var limit = "1";
var radius = "3000";

var accessor = {
  consumerSecret : auth.consumerSecret,
  tokenSecret : auth.accessTokenSecret
};

var parameters = [];
parameters.push(['term', terms]);
parameters.push(['location', near]);
parameters.push(['limit', limit]);
parameters.push(['radius_filter', radius]);
parameters.push(['category_filter', categories]);
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
  $("#restaurant").text(jqXHR.responseJSON.businesses[0].name);
}
)
.fail(function(jqXHR, textStatus, errorThrown) {
  console.log('error[' + errorThrown + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');
}
);
