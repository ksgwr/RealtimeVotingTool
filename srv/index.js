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

  app.post('/issueUserId', function(req, res){
    const userId = Util.issueUserId();
    res.send(userId);
  });

  app.post('/roomUserId', function(req, res){
    const room = Room.getOrCreateRoom(req.body.roomId);
    const userId = req.body.userId;
    const roomUserId = room.getRoomOpenUserId(userId);
    res.send(roomUserId);
  });

  const io = socketIO(http);
  io.sockets.on('connection', function(socket){
    const roomId = Util.getRoomId(socket.handshake.headers.referer);
    // TODO: validate roomId
    
    const userId = socket.handshake.query.userId;  
  
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
      const mode = room.getMode();
      io.to(roomId).emit('update_mode', room.getMode());
      room.setNextModeIfNeeded();
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

    socket.on('click_rule_voting_rule_c2s', function(data){
      console.log(`click_rule_voting_rule_c2s ${data}`);
      const ret = room.updateVotingRule(data);
      if (ret != null) {
        io.to(roomId).emit('update_rule_voting_rule', ret);
      }
    });

    socket.on('update_rule_vote_max_c2s', function(data){
      console.log(`update_rule_vote_max_c2s ${data}`);
      const ret = room.updateVoteMax(data);
      if (ret != null) {
        io.to(roomId).emit('update_rule_vote_max', ret);
      }
    });

    socket.on('update_rule_min_openable_c2s', function(data){
      console.log(`update_rule_min_openable_c2s ${data}`);
      const ret = room.updateMinOpenable(data);
      if (ret != null) {
        io.to(roomId).emit('update_rule_min_openable', ret);
      }
    });

    socket.on('edit_card_text' ,function(data) {
      console.log('edit_card_text');
      console.log(JSON.stringify(data));
      const items = room.updateItemText(data.index, data.text);
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
