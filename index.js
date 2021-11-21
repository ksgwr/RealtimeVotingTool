const express = require('express');
const app = express();
const server= require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

server.listen(PORT, function(){
  console.log('listening on *:3000');
});	

