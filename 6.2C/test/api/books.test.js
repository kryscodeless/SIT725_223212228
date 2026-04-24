'use strict';

const express = require('express');
const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const Book = require('../../models/book.model');
const bookRoutes = require('../../routes/books.routes');

// Create an isolated Express app without starting a MongoDB connection
const app = express();
app.use(express.json());
app.use('/api', bookRoutes);

const validBook = {
  id: 'test-book-0001',
  title: 'The Test Book',
  author: 'Test Author',
  year: 2020,
  genre: 'Fiction',
  summary: 'A summary long enough to pass the minimum length validation requirement in the schema.',
  price: 19.99
};

describe('POST /api/books', () => {

  let originalCreate;

  before(() => {
    // Stub Book.create so tests run without a real MongoDB connection.
    // Validation errors are thrown before Book.create is ever reached, so
    // the 400-path tests exercise the real service logic unchanged.
    originalCreate = Book.create;
    Book.create = async (doc) => ({
      ...doc,
      _id: new mongoose.Types.ObjectId(),
      toObject() { return { ...doc, _id: this._id }; }
    });
  });

  after(() => {
    Book.create = originalCreate;
  });

  describe('valid input', () => {

    it('returns 201 and the created book when all required fields are provided', async () => {
      const res = await request(app)
        .post('/api/books')
        .send(validBook);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('title', 'The Test Book');
      expect(res.body).to.have.property('id', 'test-book-0001');
    });

  });

  describe('invalid input', () => {

    it('returns 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/books')
        .send({ id: 'test-book-0002', title: 'Only Title' });
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message');
    });

    it('returns 400 when an unknown field is included', async () => {
      const res = await request(app)
        .post('/api/books')
        .send({ ...validBook, id: 'test-book-0003', hack: true });
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message');
    });

    it('returns 400 when price is zero', async () => {
      const res = await request(app)
        .post('/api/books')
        .send({ ...validBook, id: 'test-book-0004', price: 0 });
      expect(res.status).to.equal(400);
    });

    it('returns 400 when year is provided as a string instead of a number', async () => {
      const res = await request(app)
        .post('/api/books')
        .send({ ...validBook, id: 'test-book-0005', year: '2020' });
      expect(res.status).to.equal(400);
    });

  });

});
