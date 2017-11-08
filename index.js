
//Dependencies
const Twitter = require('twitter');
const http = require('http');
const config = require('./config.js');
const giphyApiKey = (process.env.apiKey || config.giphy.apiKey);
let searchString = "";
let giphyQueryUrl;


//Initialize twitter client
const client = new Twitter({
  consumer_key: process.env.consumer_key || config.twitter.consumer_key,
  consumer_secret: process.env.consumer_secret || config.twitter.consumer_secret,
  access_token_key: process.env.access_token_key || config.twitter.access_token_key,
  access_token_secret: process.env.access_token_secret || config.twitter.access_token_secret
});

process.on('unhandledRejection', (reason,promise) => {
	console.log('Unhandled Rejection at:', promise, 'reason:', reason);
})

//This stream checks for statuses containing '@VannucciBot' references, strips out the relevant seach data and feeds
//that search data to the queryGiphy function
client.stream('statuses/filter', {track: '@VannucciBot'}, (stream) => {
	stream.on('data', (tweet) => {
		searchString  = 
			tweet.text.substring(tweet.text.indexOf("@VannucciBot")+"@VannucciBot".length + 1,tweet.text.length);
		giphyQueryUrl = "http://api.giphy.com/v1/gifs/search?q="+searchString+"&api_key="+ giphyApiKey +"&limit=5&rating=g";
		if(queryGiphyAndTweet(giphyQueryUrl)) {
			console.log("Tweet sent");
		}
	})
})

//This function will query the Giphy API using the node http module and when it finds a match, posts that to twitter
//using the gifUrlToPost function
function queryGiphyAndTweet(queryUrl) {
	http.get(queryUrl, res => {
		res.setEncoding("utf8");
		let body = "";
		res.on("data", data => {
			body += data;
		});
		res.on("error", error => {
			console.log("Error: " + error);
		})
		res.on("end", () => {
			body = JSON.parse(body);
			if(gifUrlToPost(body.data[0].url)) {
				return true;
			}

		});

	});

}

//This simply posts the url of the gif passed to it
function gifUrlToPost(url) {
	client.post('statuses/update', {status: url})
		.then(tweet => {
	    	return true;
		})
	  	.catch(error => {
	    	throw error;
		});

}
