## Synopsis
This is a quick and simple local Twitter bot which looks for a handle @VannucciBot and then takes the remainder of the tweet as a search query for Giphy, returning a link with the first gif.

## Motivation
In part this is for an interview code sample projet for an internship, but also this is a good start for using the Twitter API and the HTTP module of Nodejs, and I want to grow this into a more intelligent Twitter bot

## Installation
1. Download all the files
2. Run 'npm install' in the home directory
3. Create a 'config.js' file with Twitter and GiphyAPI information
4. Run 'npm start' after the installation has completed
5. Tweet '@VannucciBot [search query]' and the bot will respond

A local version of this will be left running to respond to tweets, and work on deploying this to Heroku is ongoing

## API Reference
Giphy API
https://github.com/Giphy/GiphyAPI

Twitter API
https://github.com/desmondmorris/node-twitter