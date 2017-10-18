/* eslint-disable no-multi-spaces */
const chai     = require('chai')
const request  = require('request-promise-native')
const sinon    = require('sinon')
const fs       = require('../../lib/fs-as-promise')
const registry = require('../../lib/registry')
/* eslint-enable no-multi-spaces */

chai.use(require('chai-as-promised'))
const expect = chai.expect

/* eslint-env mocha */
describe('lib/registry', function () {
  beforeEach(() => {
    sinon.stub(fs, 'readFile')
      .returns(Promise.resolve(JSON.stringify({ foo: 'foo' })))

    sinon.stub(fs, 'writeFile')
      .returns(Promise.resolve())

    sinon.stub(request, 'get')
      .returns(Promise.resolve(JSON.stringify({
        content: Buffer.from('{"foo":"foo"}', 'utf8').toString('base64')
      })))
  })

  afterEach(() => {
    fs.readFile.restore()
    fs.writeFile.restore()
    request.get.restore()
  })

  it('is an object', () => {
    expect(registry).to.be.an('object')
  })

  describe('get()', function () {
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

  describe('update()', function () {
    it('is a function', () => expect(registry.update).to.be.a('function'))

    it('returns a promise', () => expect(registry.update()).to.be.a('promise'))

    it('updates the registry', function () {
      return registry.get()
        .then(entries => {
          expect(entries).to.be.an('object')
          expect(entries.foo).to.be.a('string')
          expect(entries.foo).to.equal('foo')
        })
        .then(() => {
          fs.readFile.restore()
          request.get.restore()

          sinon.stub(fs, 'readFile')
            .callsFake(() => Promise.reject(new Error()))

          sinon.stub(request, 'get')
            .returns(Promise.resolve(JSON.stringify({
              content: Buffer.from('{"updated": true}', 'utf8').toString('base64')
            })))
        })
        .then(registry.update)
        .then(() => registry.get())
        .then(entries => {
          expect(entries).to.be.an('object')
          expect(entries.foo).to.equal(undefined)
          expect(entries.updated).to.be.a('boolean')
          expect(entries.updated).to.equal(true)
        })
    })
  })
})
