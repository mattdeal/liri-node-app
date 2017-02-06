//todo: get command
//todo: inside get command, if args are passed, handle args

var command = process.argv[2];
switch (command) {
	case 'my-tweets':
		displayTweets();
		break;
	case 'spotify-this-song':
		break;
	case 'movie-this':
		break;
	case 'do-whatit-says':
		break;
	default:
		console.log('wut?');
		break;
}

// BEGIN TWITTER //

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
	    // console.log(tweets);
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
 
	spotify.search({ type: 'track', query: trackName }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
	 
	    // Do something with 'data'
	    console.log(data);
	});
}
