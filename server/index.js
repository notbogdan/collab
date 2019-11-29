const app = require('express')();
const http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
	socket.on(`patching`, data => {
		socket.broadcast.emit(`patching client`, data);
	})
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});