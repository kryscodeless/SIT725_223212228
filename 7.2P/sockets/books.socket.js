let ioInstance = null;

function roomForBook(bookId) {
  return `book:${bookId}`;
}

function setIo(io) {
  ioInstance = io;
}

function registerBookSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`socket connected: ${socket.id}`);

    socket.on('watch:book', ({ bookId } = {}) => {
      if (!bookId) return;
      socket.join(roomForBook(bookId));
      socket.emit('activity:new', {
        type: 'watch',
        message: `Watching book ${bookId}`,
        at: new Date().toISOString()
      });
    });

    socket.on('unwatch:book', ({ bookId } = {}) => {
      if (!bookId) return;
      socket.leave(roomForBook(bookId));
      socket.emit('activity:new', {
        type: 'unwatch',
        message: `Stopped watching book ${bookId}`,
        at: new Date().toISOString()
      });
    });

    socket.on('disconnect', () => {
      console.log(`socket disconnected: ${socket.id}`);
    });
  });
}

function emitBookCreated(payload) {
  if (!ioInstance) return;
  ioInstance.emit('book:created', payload);
}

function emitBookUpdated(bookId, payload) {
  if (!ioInstance) return;
  ioInstance.to(roomForBook(bookId)).emit('book:updated', payload);
}

function emitActivity(payload) {
  if (!ioInstance) return;
  ioInstance.emit('activity:new', payload);
}

module.exports = {
  setIo,
  registerBookSocketHandlers,
  emitBookCreated,
  emitBookUpdated,
  emitActivity
};
