const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const bookRoutes = require('./routes/books.routes');

const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017/books_catalog_54d';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection failed:', err));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', bookRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));