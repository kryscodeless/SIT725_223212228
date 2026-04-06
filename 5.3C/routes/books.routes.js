const express = require('express');
const router = express.Router();
const { getAllBooks, getBookById } = require('../controllers/books.controller');

router.get('/books', getAllBooks);
router.get('/books/:id', getBookById);
router.get('/integrity-check42', (req, res) => res.sendStatus(204));

module.exports = router;