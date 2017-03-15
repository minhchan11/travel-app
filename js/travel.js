// var apiYelpKey = require.("./../.env").apiYelpKey;



function Travel(){
  this.place = "";
}

Travel.prototype.getLocalBusinesses = function (business) {
  $.get('https://api.yelp.com/v2/search/')

};

Travel.prototype.getInfo = function (place) {
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
        console.log(data)
  //      $("#article").html(data.parse.text["*"])

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
