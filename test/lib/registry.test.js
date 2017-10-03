/* eslint-disable no-multi-spaces */
const chai     = require('chai')
const sinon    = require('sinon')
const fs       = require('../../lib/fs-as-promise')
const registry = require('../../lib/registry')
/* eslint-enable no-multi-spaces */
const expect = chai.expect

/* eslint-env mocha */
describe('lib/registry', function () {
  it('is an object', () => expect(registry).to.be.an('object'))

  describe('get()', function () {
    beforeEach(() => {
      sinon.stub(fs, 'readFile').returns(Promise.resolve(JSON.stringify({
        foo: 'foo',
        bar: 'bar'
      })))
      sinon.stub(fs, 'writeFile')
    })
    afterEach(() => {
      fs.readFile.restore()
      fs.writeFile.restore()
    })

    it('is a function', () => expect(registry.get).to.be.a('function'))

    it('accepts an array as argument', () => {
      return Promise.all([
        expect(registry.get()).to.be.fulfilled,
        expect(registry.get(['foo', 'bar'])).to.be.fulfilled
      ])
    })

    it('rejects when passed argument other than array', () => {
      return Promise.all(['foo', true, 123, null, [], {}].map(value => {
        return expect(registry.get(value)).to.be.rejected
      }))
    })

    it('returns a promise', function () {
      const promises = []

      expect((() => {
        promises.push(registry.get())
        return promises.slice(-1)[0]
      })()).to.be.a('promise')

      expect((() => {
        promises.push(registry.get(['foo', 'bar']))
        return promises.slice(-1)[0]
      })()).to.be.a('promise')
    })
  })
})
