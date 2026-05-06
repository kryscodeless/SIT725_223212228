const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const { Server } = require('socket.io');

const bookRoutes = require('./routes/books.routes');
const { registerBookSocketHandlers, setIo } = require('./sockets/books.socket');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017/books_catalog_54d';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection failed:', err));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', bookRoutes);

setIo(io);
registerBookSocketHandlers(io);

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));