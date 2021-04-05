const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express();

server.use(express.static(__dirname));

server.use("/", (req, res) => res.sendFile(INDEX, { root: __dirname }));

server.listen(PORT, () => console.log(`Listening on ${PORT}`));


const wss = new Server({ server });


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
