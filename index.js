const express = require('express')
const http = require('http')
const WebSocket = require('ws')

const PORT = process.env.PORT || 8080;
const INDEX = '/index.html';
const WHEEL = '/wheel.html';
const port = process.env.PORT || 8080
const app = express()
const httpServer = http.createServer(app)

app.use(express.static(__dirname));

app.use("/", (req, res) => res.sendFile(INDEX, { root: __dirname }));
app.use("/wheel", (req, res) => res.sendFile(WHEEL, { root: __dirname }));

CLIENTS = [];
WIDGETS = {};
connectionIDCounter = 0;


const wss = new WebSocket.Server({
    'server': httpServer
})
httpServer.listen(port);

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

wss.on('connection', function connection(ws) {
  CLIENTS.push(ws);
  CLIENTS.forEach((client,id)=>client.send(JSON.stringify({yourId: id })));

  ws.on('message', function incoming(message) {
    let data = JSON.parse(message);
    if(data.myId&&data.duid){
      if (!WIDGETS[data.duid])
        WIDGETS[data.duid]=[]
      WIDGETS[data.duid].push(data.myId);
      console.log('received: %s', message);
    }

    if(data.duid){
      if(!WIDGETS[data.duid]||!WIDGETS[data.duid].length)
        return false;
      WIDGETS[data.duid].forEach(clienId => {
        let client = CLIENTS[clienId];
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      })
    }

  //  console.log('received: %s', message);
    //  wss.broadcast(message);
  });
  ws.on("close", function close(data,) {
       console.log("Disconnected",data);
   });
});




