const twitterBot = require('./twitterbot.js').checkTwitterForNewTweets;
const express = require('express');

const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

let twitterBotOutput;

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

console.log("Checking for new tweets");
twitterBotOutput = setInterval(twitterBot,1000);

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
    // client.send(JSON.stringify(twitterBotOutput));
  });
}, 1000);



