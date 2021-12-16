import express from 'express';
import socketIO from 'socket.io';

import Util from './lib/Util';
import Room from './models/Room';

const PORT = process.env.PORT || 3000;

export default (app, http) => {
  app.use(express.json());
  app.set('port', PORT);

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

    socket.on('update_edit_mode_c2s', function(data) {
      console.log('update_edit_mode');
      room.updateEdit(data);
      io.to(roomId).emit('update_mode', room.getMode());
    });

    socket.on('click_card_control', function(data) {
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
