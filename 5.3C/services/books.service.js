const Book = require('../models/book.model');

const getAllBooks = () => Book.find({});

const getBookById = (id) => Book.findById(id);

module.exports = { getAllBooks, getBookById };