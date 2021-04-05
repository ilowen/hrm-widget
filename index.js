const express = require('express')
const http = require('http')
const WebSocket = require('ws')

const PORT = process.env.PORT || 8080;
const INDEX = '/index.html';

const port = process.env.PORT || 8080
const app = express()
const httpServer = http.createServer(app)

app.use(express.static(__dirname));

app.use("/", (req, res) => res.sendFile(INDEX, { root: __dirname }));




const wss = new WebSocket.Server({
    'server': httpServer
})
httpServer.listen(port);

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === webSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    wss.broadcast(message);
  });

  ws.send(JSON.stringify({type:'speech',text:'Привет Ебты с сервера!'}));
});
