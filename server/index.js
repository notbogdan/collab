const app = require('express')();
const http = require('http').createServer(app);
var io = require('socket.io')(http);
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json')
const db = lowdb(adapter)
const MST = require('mobx-state-tree');

db.defaults({ store: {
  playbackState: {
    updatedAt: 0,
    playing: false
  }
} }).write();

const Store = MST.types.model(`Store`, {
  objects: MST.types.optional(MST.types.map(MST.types.frozen()), {}),
  currentTime: 0,
  playbackState: MST.types.frozen(),
});
const store = Store.create(db.get('store').value())

io.on('connection', function(socket){
  socket.on('stateRequest', (name, fn) => {
    console.log(fn)
    fn(db.get(`store`).value());
  });
  socket.on(`patching`, data => {
    console.log(`Patching`)
    MST.applyPatch(store, data);
    db.set(`store`, store.toJSON()).write();
		socket.broadcast.emit(`patching client`, data);
	})
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});