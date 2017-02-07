//todo: get command
//todo: inside get command, if args are passed, handle args

var command = process.argv[2];
switch (command) {
	case 'my-tweets':
		displayTweets();
		break;
	case 'spotify-this-song':
		displaySpotify(process.argv[3]);
		break;
	case 'movie-this':
		displayMovie(process.argv[3]);
		break;
	case 'do-whatit-says':
		break;
	default:
		console.log('wut?');
		break;
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
	    	console.log(tweets[i].created_at + ' ' + tweets[i].text);
	    }
	  } else {
	  	console.log(error);
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
				console.log('Error occurred: ' + err);
		        return;
			}

			var artistList = [];
	    	for (var i = 0; i < data.artists.length; i++) {
	    		artistList.push(data.artists[i].name);
	    	}

			console.log('Artist(s): ' + artistList);
		    console.log('Name: ' + data.name);
		    console.log('Preview: ' + data.preview_url);
		    console.log('Album: ' + data.album.name);
		});
	} else {
		options.type = 'track';
		options.query = trackName;

		spotify.search(options, function(err, data) {
		    if ( err ) {
		        console.log('Error occurred: ' + err);
		        return;
		    }
		 
		    // console.log(data.tracks);

		    if (data.tracks.items.length > 0) {
		    	var track = data.tracks.items[0];
		    	var artistList = [];

		    	for (var i = 0; i < track.artists.length; i++) {
		    		artistList.push(track.artists[i].name);
		    	}

			    console.log('Artist(s): ' + artistList.join(', '));
			    console.log('Name: ' + track.name);
			    console.log('Preview: ' + track.preview_url);
			    console.log('Album: ' + track.album.name);
		    } else {
		    	console.log('no results...');
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

	    	console.log('Title: ' + movie.Title);
	    	console.log('Year: ' + movie.Year);
	    	console.log('IMBD Rating: ' + movie.imdbRating);
	    	console.log('Country: ' + movie.Country);
	    	console.log('Language: ' + movie.Language);
	    	console.log('Plot: ' + movie.Plot);
	    	console.log('Actors: ' + movie.Actors);
	    	console.log('Rotten Tomatoes Rating: ' + movie.tomatoRating);
	    	console.log('Rotten Tomatoes URL: ' + movie.tomatoURL);
	  	} else {
	  		console.log(error);
	  	}
	});
}