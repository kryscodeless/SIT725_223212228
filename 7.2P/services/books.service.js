const mongoose = require('mongoose');
const Book = require('../models/book.model');

const POST_FIELDS = ['id', 'title', 'author', 'year', 'genre', 'summary', 'price'];
const PUT_FIELDS = ['title', 'author', 'year', 'genre', 'summary', 'price'];

function formatBook(book) {
  if (!book) return null;
  const doc = book.toObject ? book.toObject() : book;
  const dto = {
    _id: doc._id,
    title: doc.title,
    author: doc.author,
    year: doc.year,
    genre: doc.genre,
    summary: doc.summary,
    price: doc.priceAud.toString()
  };
  if (doc.bookId) dto.id = doc.bookId;
  return dto;
}

function assertWhitelist(body, allowedKeys, contextLabel) {
  const keys = Object.keys(body);
  const unknown = keys.filter((k) => !allowedKeys.includes(k));
  if (unknown.length) {
    const err = new Error(
      `Unknown or disallowed fields for ${contextLabel}: ${unknown.join(', ')}`
    );
    err.statusCode = 400;
    throw err;
  }
}

function assertAllPostFieldsPresent(body) {
  const missing = POST_FIELDS.filter((k) => body[k] === undefined || body[k] === null);
  if (missing.length) {
    const err = new Error(`Missing required field(s): ${missing.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }
}

function assertAllPutFieldsPresent(body) {
  const missing = PUT_FIELDS.filter((k) => body[k] === undefined || body[k] === null);
  if (missing.length) {
    const err = new Error(`Missing required field(s) for update: ${missing.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }
}

function parseYear(value) {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    const err = new Error('year must be an integer');
    err.statusCode = 400;
    throw err;
  }
  return value;
}

function parsePriceToDecimal128(value) {
  if (value === undefined || value === null) {
    const err = new Error('price is required');
    err.statusCode = 400;
    throw err;
  }
  const raw = typeof value === 'number' ? value.toFixed(2) : String(value).trim();
  if (!/^\d+(\.\d{1,2})?$/.test(raw)) {
    const err = new Error('price must be a non-negative decimal string with at most two fractional digits');
    err.statusCode = 400;
    throw err;
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0 || n > 99999.99) {
    const err = new Error('price must be greater than 0 and at most 99999.99 AUD');
    err.statusCode = 400;
    throw err;
  }
  return mongoose.Types.Decimal128.fromString(raw);
}

function validateBookId(value) {
  const bookId = String(value).trim();
  if (bookId.length < 4 || bookId.length > 32 || !/^[A-Za-z0-9-]+$/.test(bookId)) {
    const err = new Error('id must be 4–32 characters and use only letters, digits, or hyphens');
    err.statusCode = 400;
    throw err;
  }
  return bookId;
}

function mapWritableFields(body) {
  return {
    title: String(body.title).trim(),
    author: String(body.author).trim(),
    year: parseYear(body.year),
    genre: String(body.genre).trim(),
    summary: String(body.summary).trim(),
    priceAud: parsePriceToDecimal128(body.price)
  };
}

const getAllBooks = () => Book.find({});

const getBookById = (id) => Book.findById(id);

const createBook = async (body) => {
  assertWhitelist(body, POST_FIELDS, 'create');
  assertAllPostFieldsPresent(body);
  const bookId = validateBookId(body.id);
  const doc = { bookId, ...mapWritableFields(body) };
  try {
    return await Book.create(doc);
  } catch (err) {
    if (err.code === 11000) {
      const dup = new Error('A book with this id already exists');
      dup.statusCode = 409;
      dup.code = 11000;
      throw dup;
    }
    throw err;
  }
};

const updateBook = async (mongoId, body) => {
  if (Object.prototype.hasOwnProperty.call(body, 'id')) {
    const err = new Error('book id is immutable and must not be included in the update body');
    err.statusCode = 400;
    throw err;
  }
  assertWhitelist(body, PUT_FIELDS, 'update');
  assertAllPutFieldsPresent(body);

  const book = await Book.findById(mongoId);
  if (!book) {
    const err = new Error('Book not found');
    err.statusCode = 404;
    throw err;
  }

  const next = mapWritableFields(body);
  book.title = next.title;
  book.author = next.author;
  book.year = next.year;
  book.genre = next.genre;
  book.summary = next.summary;
  book.priceAud = next.priceAud;

  await book.save();
  return book;
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  formatBook,
  parsePriceToDecimal128
};
