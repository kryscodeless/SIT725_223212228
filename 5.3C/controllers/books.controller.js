const Book = require('../models/book.model');

const getAllBooks = async (req, res) => {
  const books = await Book.find({});
  const result = books.map(book => ({
    _id: book._id,
    title: book.title,
    author: book.author,
    year: book.year,
    genre: book.genre,
    summary: book.summary,
    priceAud: book.priceAud.toString()
  }));
  res.json(result);
};

const getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json({
    _id: book._id,
    title: book.title,
    author: book.author,
    year: book.year,
    genre: book.genre,
    summary: book.summary,
    priceAud: book.priceAud.toString()
  });
};

module.exports = { getAllBooks, getBookById };