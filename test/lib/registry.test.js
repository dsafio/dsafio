const fs       = require('fs')
const chai     = require('chai')
const sinon    = require('sinon')
const util     = require('util')
// const config   = require('../../lib/config')
const registry = require('../../lib/registry')

const expect = chai.expect

if (!process.env.DSAFIO_CACHE_FILE) {
  console.log('Please provide an environment variable DSAFIO_CACHE_FILE')
  process.exit(1)
}

describe('lib/registry', function () {

  it('is an object', () => expect(registry).to.be.an('object'))

  describe('get()', function () {

    it('is a function', () => expect(registry.get).to.be.a('function'))

    it('accepts an array as argument', function () {
      expect(() => registry.get()).to.not.throw()
      expect(() => registry.get(['foo', 'bar'])).to.not.throw()

      ;['foo', true, 123, null, [], {}].forEach(value => {
        expect(() => registry.get(value)).to.throw()
      })
    })

    it('returns a promise', function () {
      expect(registry.get()).to.be.a('promise')
      expect(registry.get(['foo', 'bar'])).to.be.a('promise')
    })

  })

})
