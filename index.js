const serve = require('koa-static');
const Koa = require('koa');
const webSocket = require('ws');
const app = new Koa();

const PORT = process.env.PORT || 3000;



const wss = new webSocket.Server({ port: 8080 });



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

// $ GET /package.json
app.use(serve('.'));

// $ GET /hello.txt
app.use(serve('test/fixtures'));

// or use absolute paths
app.use(serve(__dirname + '/src/'));

app.listen(PORT, err => {
    if(err) throw err;
    console.log("%c Server running", "color: green");
});
