'use strict';

const { expect } = require('chai');
const mongoose = require('mongoose');
const { parsePriceToDecimal128 } = require('../../services/books.service');

describe('parsePriceToDecimal128', () => {

  describe('valid prices', () => {

    it('parses a valid price string and returns a Decimal128', () => {
      const result = parsePriceToDecimal128('10.50');
      expect(result).to.be.instanceOf(mongoose.Types.Decimal128);
      expect(result.toString()).to.equal('10.50');
    });

    it('parses a numeric value and returns a Decimal128', () => {
      const result = parsePriceToDecimal128(19.99);
      expect(result).to.be.instanceOf(mongoose.Types.Decimal128);
    });

    it('accepts the lower boundary value 0.01', () => {
      const result = parsePriceToDecimal128('0.01');
      expect(result).to.be.instanceOf(mongoose.Types.Decimal128);
      expect(result.toString()).to.equal('0.01');
    });

    it('accepts the upper boundary value 99999.99', () => {
      const result = parsePriceToDecimal128('99999.99');
      expect(result).to.be.instanceOf(mongoose.Types.Decimal128);
      expect(result.toString()).to.equal('99999.99');
    });

  });

  describe('invalid prices', () => {

    it('throws when price is null', () => {
      expect(() => parsePriceToDecimal128(null)).to.throw('price is required');
    });

    it('throws when price is zero', () => {
      expect(() => parsePriceToDecimal128(0)).to.throw();
    });

    it('throws when price is negative', () => {
      expect(() => parsePriceToDecimal128(-5)).to.throw();
    });

    it('throws when price exceeds the maximum of 99999.99', () => {
      expect(() => parsePriceToDecimal128(100000)).to.throw();
    });

    it('throws when price is a non-numeric string', () => {
      expect(() => parsePriceToDecimal128('not-a-price')).to.throw();
    });

    it('throws when price has more than two decimal places', () => {
      expect(() => parsePriceToDecimal128('10.999')).to.throw();
    });

  });

});
