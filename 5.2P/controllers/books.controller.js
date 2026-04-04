const booksService = require('../services/books.service');

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await booksService.getAllBooks();
    res.status(200).json({ statusCode: 200, data: books, message: 'Books retrieved' });
  } catch (err) {
    next(err);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const book = await booksService.getBookById(req.params.id);
    if (!book) return res.status(404).json({ statusCode: 404, message: 'Book not found' });
    res.status(200).json({ statusCode: 200, data: book, message: 'Book retrieved' });
  } catch (err) {
    next(err);
  }
};