const chai   = require('chai')
const sinon  = require('sinon')
const util   = require('util')
const config = require('../../lib/config')
const io     = require('../../lib/config-io')

const assert = chai.assert
const expect = chai.expect

describe('lib/config', function () {

  it('is an object', () => expect(config).to.be.an('object'))

  describe('get()', function () {

    beforeEach(() => sinon.stub(io, 'read').returns(Promise.resolve(JSON.stringify({
      user: 'john-doe',
      email: 'john@doe.com'
    }))))
    afterEach(() => io.read.restore())

    it('is a function', () => expect(config.get).to.be.a('function'))

    it('accepts an array as argument', function () {
      expect(() => config.get()).to.not.throw()
      expect(() => config.get(['user', 'email'])).to.not.throw()

      ;['foo', true, 123, null, [], {}].forEach(value => {
        expect(() => config.get(value)).to.throw()
      })
    })

    it('returns a promise', function () {
      expect(config.get()).to.be.a('promise')
      expect(config.get(['user', 'email'])).to.be.a('promise')
    })

  })

  describe('set()', function () {

    beforeEach(() => {
      sinon.stub(io, 'read').returns(Promise.resolve('{}'))
      sinon.stub(io, 'write')
    })
    afterEach(() => {
      io.read.restore()
      io.write.restore()
    })

    it('is a function', () => expect(config.set).to.be.a('function'))

    it('requires an object argument', function () {
      expect(config.set).to.throw()
      expect(() => config.set({foo: 'bar'})).to.not.throw()
    })

    it('returns a promise', function () {
      expect(config.set({foo: 'bar'})).to.be.a('promise')
    })

    it('uses config-io to write user configurations to disk', function () {
      return config.set({foo: 'bar'})
        .then(() => {
          expect(io.read.called).to.be.ok
          expect(io.write.withArgs('{\n  "foo": "bar"\n}').called).to.be.ok
        })
    })

  })

})
