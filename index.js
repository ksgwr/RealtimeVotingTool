const express = require('express');
const app = express();
const server= require('http').Server(app);
const socketio = require('socket.io');
const PORT = process.env.PORT || 3000
const router = express.Router();
const io = socketio(server);

const Util = require('./lib/Util');
const Room = require('./models/Room');

router
  .get('/room/:id', function(req, res){
    // TODO: validation and password check
    res.sendFile(__dirname + '/views/room.html');
  }) 
  .get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
  })
  ;

app.use(express.static(__dirname + '/public'));
app.use('/', router);

io.sockets.on('connection', function(socket){
  const roomId = Util.getRoomId(socket.handshake.headers.referer);
  // TODO: validate roomId
  
  const userId = Util.issueUserId();  

  socket.join(roomId);
  const room = Room.getOrCreateRoom(roomId);
  const users = room.updateUser(userId, {});

  socket.on('update_user', function(data) {
    const users = room.updateUser(userId, data);
    console.log('update_user');
    console.log(users);
    console.log(data);
    socket.broadcast.to(roomId).emit('update_users', users);
  });
  //io.to(roomId).emit('update_members', {});

  console.log(`room: ${roomId} user: ${userId} join`);
  socket.on('disconnect', function(data) {
    const users = room.updateUser(userId, null);
    socket.broadcast.to(roomId).emit('update_users', users);
    console.log(`disconnect room: ${roomId} user: ${userId}`);
  });
  
  // send all data
  socket.emit('update_users', users);
});

server.listen(PORT, function(){
  console.log('listening on *:3000');
});	

