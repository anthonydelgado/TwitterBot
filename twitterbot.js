
//Dependencies
let cycleCount = 0;
const Twitter = require('twitter');
const http = require('http');
const config = require('./config.js');
let searchString = "";
let giphyQueryUrl;
let lastTweetRespondedIdStr = [];


//Initialize client
const client = new Twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key: config.twitter.access_token_key,
  access_token_secret: config.twitter.access_token_secret
});

process.on('unhandledRejection', (reason,promise) => {
	console.log('Unhandled Rejection at:', promise, 'reason:', reason);
})

exports.checkTwitterForNewTweets = function () {
	cycleCount++;
	let statusObject = {
		cycle: cycleCount,
		postSuccess: false,
		errors: ""
	}
	console.log("Cycle Count: " + cycleCount);
 	//Get all tweets with query 'node.js'
	client.get('search/tweets', {q: 'VannucciBot'}, function(error, tweets, response) {
		if(error) {
			console.log("Error: " + error);
			statusObject.errors = error;
		}


		for(let i = 0; i < tweets.statuses.length; i++) {
			if(tweets.statuses[i].text.indexOf("VannucciBot") > -1 && lastTweetRespondedIdStr.indexOf(tweets.statuses[i].id_str) === -1) {
				lastTweetRespondedIdStr.push(tweets.statuses[i].id_str);
				searchString  = 
					tweets.statuses[i].text.substring(tweets.statuses[i].text.indexOf("VannucciBot")+"VannucciBot".length + 1,tweets.statuses[i].text.length);
				giphyQueryUrl = "http://api.giphy.com/v1/gifs/search?q="+searchString+"&api_key="+config.giphy.apiKey+"&limit=5&rating=g";
				if(queryGiphyAndTweet(giphyQueryUrl)) {
					statusObject.postSuccess = true;
				}
				break;
			}
			

		}

	   
	});


	return statusObject;
}

function queryGiphyAndTweet(queryUrl) {
	http.get(queryUrl, (res) => {
		res.setEncoding("utf8");
		let body = "";
		res.on("data", data => {
			body += data;
		});
		res.on("end", () => {
			body = JSON.parse(body);
			if(gifUrlToPost(body.data[0].url)) {
				return true;
			}

		});

	});

}

function gifUrlToPost(url) {
	client.post('statuses/update', {status: url})
		.then(function(tweet) {
	    	return true;
		})
	  	.catch(function(error) {
	    	throw error;
		});

}
