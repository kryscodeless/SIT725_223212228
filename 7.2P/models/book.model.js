const mongoose = require('mongoose');

const currentYear = () => new Date().getFullYear();

const bookSchema = new mongoose.Schema({
  bookId: {
    type: String,
    trim: true,
    minlength: [4, 'id must be at least 4 characters'],
    maxlength: [32, 'id must be at most 32 characters'],
    match: [/^[A-Za-z0-9-]+$/, 'id may only contain letters, digits, and hyphens'],
    unique: true,
    sparse: true
  },
  title: {
    type: String,
    required: [true, 'title is required'],
    trim: true,
    minlength: [1, 'title cannot be empty'],
    maxlength: [200, 'title exceeds maximum length']
  },
  author: {
    type: String,
    required: [true, 'author is required'],
    trim: true,
    minlength: [1, 'author cannot be empty'],
    maxlength: [100, 'author exceeds maximum length']
  },
  year: {
    type: Number,
    required: [true, 'year is required'],
    min: [1450, 'year is before the earliest allowed publication year'],
    max: [currentYear(), 'year cannot be in the future']
  },
  genre: {
    type: String,
    required: [true, 'genre is required'],
    trim: true,
    minlength: [1, 'genre cannot be empty'],
    maxlength: [50, 'genre exceeds maximum length']
  },
  summary: {
    type: String,
    required: [true, 'summary is required'],
    trim: true,
    minlength: [20, 'summary is shorter than the minimum length'],
    maxlength: [1500, 'summary exceeds maximum length']
  },
  priceAud: {
    type: mongoose.Schema.Types.Decimal128,
    required: [true, 'price is required'],
    validate: {
      validator(value) {
        if (value === undefined || value === null) return false;
        const n = parseFloat(value.toString());
        return Number.isFinite(n) && n > 0 && n <= 99999.99;
      },
      message: 'price must be a positive AUD amount not exceeding 99999.99'
    }
  }
});

module.exports = mongoose.model('Book', bookSchema);
