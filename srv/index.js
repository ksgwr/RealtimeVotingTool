import cors from 'cors';
import express from 'express';
import socketIO from 'socket.io';

import Util from './lib/Util';
import Room from './models/Room';

const PORT = process.env.PORT || 3000;

export default (app, http) => {
  app.use(express.json());
  app.set('port', PORT);
  // for fallback in developing
  app.use(cors({
    origin: 'http://localhost:8080'
  }));

  app.get('/result', function(req, res){
    const room = Room.getOrCreateRoom(req.query.roomId);
    res.send(room.getResults());
  });

  const io = socketIO(http);
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
  
    socket.on('update_mode_c2s', function(data) {
      console.log('update_mode', data);
      room.setMode(data);
      io.to(roomId).emit('update_mode', room.getMode());
    });

    socket.on('update_vote_c2s', function(data) {
      console.log('update_vote');
      console.log(data);
      if (data == null) {
        room.voteCancel(userId);
      } else {
        room.voteOk(userId, data);
      }
      console.log(room.vote.getOnGoingResult());
      io.to(roomId).emit('update_votes', room.getOnGoingResult());
    });

    socket.on('click_card_control', function(data) {
      console.log('click_card_control');
      const items = room.updateItemsSize(data);
      io.to(roomId).emit('update_items', items);
    });

    console.log(`room: ${roomId} user: ${userId} join`);
    socket.on('disconnect', function() {
      const users = room.updateUser(userId, null);
      socket.broadcast.to(roomId).emit('update_users', users);
      console.log(`disconnect room: ${roomId} user: ${userId}`);
    });
    
    // send all data
    socket.emit('load_data', room.getInitialData());
  });
  
}
