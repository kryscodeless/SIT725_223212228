const mongoose = require('mongoose');
const Book = require('./models/book.model');

const MONGO_URI = 'mongodb://localhost:27017/books_catalog_53c';

const books = [
  {
    title: 'The Three-Body Problem',
    author: 'Liu Cixin',
    year: 2008,
    genre: 'Science Fiction',
    summary: "The Three-Body Problem is the first novel in the Remembrance of Earth's Past trilogy...",
    priceAud: mongoose.Types.Decimal128.fromString('24.99')
  },
  {
    title: 'Jane Eyre',
    author: 'Charlotte Bronte',
    year: 1847,
    genre: 'Classic',
    summary: 'An orphaned governess confronts class, morality, and love at Thornfield Hall...',
    priceAud: mongoose.Types.Decimal128.fromString('19.95')
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    year: 1813,
    genre: 'Classic',
    summary: 'Elizabeth Bennet and Mr. Darcy navigate pride, misjudgement, and social expectations...',
    priceAud: mongoose.Types.Decimal128.fromString('17.50')
  },
  {
    title: 'The English Patient',
    author: 'Michael Ondaatje',
    year: 1992,
    genre: 'Historical Fiction',
    summary: 'In a ruined Italian villa at the end of WWII, four strangers with intersecting pasts...',
    priceAud: mongoose.Types.Decimal128.fromString('22.40')
  },
  {
    title: 'Small Gods',
    author: 'Terry Pratchett',
    year: 1992,
    genre: 'Fantasy',
    summary: 'In Omnia, the god Om returns as a tortoise, and novice Brutha must confront dogma...',
    priceAud: mongoose.Types.Decimal128.fromString('21.00')
  }
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Book.deleteMany({});
  console.log('Cleared existing books');

  await Book.insertMany(books);
  console.log('Seeded 5 books');

  await mongoose.disconnect();
  console.log('Done');
}

seed();