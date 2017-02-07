handleCommand(process.argv[2], process.argv[3]);

function handleCommand(command, detail) {
	switch (command) {
		case 'my-tweets':
			displayTweets();
			break;
		case 'spotify-this-song':
			displaySpotify(detail);
			break;
		case 'movie-this':
			displayMovie(detail);
			break;
		case 'do-what-it-says':
			displayTextCommand();
			break;
		default:
			doLog('wut?');
			break;
	}
}

function displayTweets() {
	// load keys.js
	var twitterConfig = require('./keys.js');
	var twitterKeys = twitterConfig.twitterKeys;

	// Twitter Config - move inside function
	var Twitter = require('twitter');
	var client = new Twitter({
	  consumer_key: twitterKeys.consumer_key,
	  consumer_secret: twitterKeys.consumer_secret,
	  access_token_key: twitterKeys.access_token_key,
	  access_token_secret: twitterKeys.access_token_secret
	});

	// get tweets - clean up creation time
	var params = {screen_name: 'EmDubDe'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    for (var i = 0; i < tweets.length && i < 20; i++) {
	    	doLog(tweets[i].created_at + ' ' + tweets[i].text);
	    }
	  } else {
	  	doLog(error);
	  }
	});
}

function displaySpotify(trackName) {
	var spotify = require('spotify');
	var options = {};

	if (trackName === undefined) {
		options.type = 'track';
		options.id = '0hrBpAOgrt8RXigk83LLNE';

		spotify.lookup(options, function(err, data) {
			if (err) {
				doLog('Error occurred: ' + err);
		        return;
			}

			var artistList = [];
	    	for (var i = 0; i < data.artists.length; i++) {
	    		artistList.push(data.artists[i].name);
	    	}

			doLog('Artist(s): ' + artistList);
		    doLog('Name: ' + data.name);
		    doLog('Preview: ' + data.preview_url);
		    doLog('Album: ' + data.album.name);
		});
	} else {
		options.type = 'track';
		options.query = trackName;

		spotify.search(options, function(err, data) {
		    if ( err ) {
		        doLog('Error occurred: ' + err);
		        return;
		    }
		 
		    // doLog(data.tracks);

		    if (data.tracks.items.length > 0) {
		    	var track = data.tracks.items[0];
		    	var artistList = [];

		    	for (var i = 0; i < track.artists.length; i++) {
		    		artistList.push(track.artists[i].name);
		    	}

			    doLog('Artist(s): ' + artistList.join(', '));
			    doLog('Name: ' + track.name);
			    doLog('Preview: ' + track.preview_url);
			    doLog('Album: ' + track.album.name);
		    } else {
		    	doLog('no results...');
		    }	    
		});
	}	
}

function displayMovie(movieName) {
	var request = require('request');
	var url = '';
	if (movieName === undefined) {
		url = 'http://www.omdbapi.com/?i=tt0485947&plot=short&r=json&tomatoes=true';
	} else {
		url = 'http://www.omdbapi.com/?t=' + 
			encodeURIComponent(movieName) + 
			'&y=&plot=short&r=json&tomatoes=true';	
	}

	request(url, function (error, response, data) {
		if (!error && response.statusCode == 200) {
	    	var movie = JSON.parse(data);

	    	doLog('Title: ' + movie.Title);
	    	doLog('Year: ' + movie.Year);
	    	doLog('IMBD Rating: ' + movie.imdbRating);
	    	doLog('Country: ' + movie.Country);
	    	doLog('Language: ' + movie.Language);
	    	doLog('Plot: ' + movie.Plot);
	    	doLog('Actors: ' + movie.Actors);
	    	doLog('Rotten Tomatoes Rating: ' + movie.tomatoRating);
	    	doLog('Rotten Tomatoes URL: ' + movie.tomatoURL);
	  	} else {
	  		doLog(error);
	  	}
	});
}

function displayTextCommand() {
	var fs = require("fs");

	fs.readFile("random.txt", "utf8", function(error, data) {
	  var dataArr = data.split(",");
	  handleCommand(dataArr[0], dataArr[1]);
	});
}

function doLog(text) {
	//append to text file
	console.log(text);
}