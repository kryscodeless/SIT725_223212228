const express = require('express');
const path = require('path');

const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const booksRoute = require('./routes/books.routes');
app.use('/api/books', booksRoute);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));