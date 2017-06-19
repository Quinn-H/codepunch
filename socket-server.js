'use strick'

var socketIO = require('socket.io');
var ot = require('ot');
var roomList = {};

module.exports = function(server) {
  var str = '// Please read instructions below  \n\n' +
            '// 1. Send url link to your collaborator \n\n' +
            '// 2. Send your userId to collaborator,\n\n ' +
            '// then they can make video call by \n\n' +
            '// enter your userId in the box which above \n\n' +
            '// the chatbox';

  var io = socketIO(server);
  io.on('connection', function(socket) {
    socket.on('joinRoom', function(data){
      if (!roomList[data.room]) {
        var socketIOServer = new ot.EditorSocketIOServer(str, [], data.room, function(socket, cb) {
          var self = this;
          Task.findByIdAndUpdate(data.room, {content: self.document}, function(err) {
            if (err) return cb(false);
            cb(true);
          });
        });
        roomList[data.room] = socketIOServer;
      }
      roomList[data.room].addClient(socket);
      roomList[data.room].setName(socket, data.username);
      socket.room = data.room;
      socket.join(data.room);
    });
    socket.on('chatMessage', function(data) {
      io.to(socket.room).emit('chatMessage', data);
    });
    socket.on('disconnect', function() {
      socket.leave(socket.room);
    });
  })
}
