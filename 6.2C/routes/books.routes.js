const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook
} = require('../controllers/books.controller');

router.get('/integrity-check42', (req, res) => res.sendStatus(204));
router.get('/books', getAllBooks);
router.post('/books', createBook);
router.get('/books/:id', getBookById);
router.put('/books/:id', updateBook);

module.exports = router;
