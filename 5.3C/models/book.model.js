const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true, trim: true },
  summary: { type: String, required: true, trim: true },
  priceAud: { type: mongoose.Schema.Types.Decimal128, required: true }
});

module.exports = mongoose.model('Book', bookSchema);