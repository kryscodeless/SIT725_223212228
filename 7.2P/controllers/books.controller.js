const mongoose = require('mongoose');
const booksService = require('../services/books.service');
const {
  emitBookCreated,
  emitBookUpdated,
  emitActivity
} = require('../sockets/books.socket');

function mapWriteError(err, res) {
  if (err.code === 11000) {
    return res.status(409).json({ message: 'A book with this id already exists' });
  }
  if (err.statusCode === 404) {
    return res.status(404).json({ message: err.message });
  }
  if (err.statusCode === 400) {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join('; ');
    return res.status(400).json({ message: messages });
  }
  return res.status(500).json({ message: 'Server error' });
}

const getAllBooks = async (req, res) => {
  try {
    const books = await booksService.getAllBooks();
    res.json(books.map(booksService.formatBook));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getBookById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid book id format' });
  }
  try {
    const book = await booksService.getBookById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(booksService.formatBook(book));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createBook = async (req, res) => {
  try {
    const book = await booksService.createBook(req.body || {});
    const formattedBook = booksService.formatBook(book);

    emitBookCreated({
      _id: formattedBook._id,
      title: formattedBook.title,
      price: formattedBook.price,
      at: new Date().toISOString()
    });
    emitActivity({
      type: 'book:created',
      message: `New book created: ${formattedBook.title}`,
      at: new Date().toISOString()
    });

    res.status(201).json(formattedBook);
  } catch (err) {
    mapWriteError(err, res);
  }
};

const updateBook = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid book id format' });
  }
  try {
    const book = await booksService.updateBook(req.params.id, req.body || {});
    const formattedBook = booksService.formatBook(book);

    emitBookUpdated(formattedBook._id, {
      _id: formattedBook._id,
      title: formattedBook.title,
      changed: Object.keys(req.body || {}),
      at: new Date().toISOString()
    });
    emitActivity({
      type: 'book:updated',
      message: `Book updated: ${formattedBook.title}`,
      at: new Date().toISOString()
    });

    res.status(200).json(formattedBook);
  } catch (err) {
    mapWriteError(err, res);
  }
};

module.exports = { getAllBooks, getBookById, createBook, updateBook };
