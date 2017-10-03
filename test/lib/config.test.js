/* eslint-disable no-multi-spaces */
const chai   = require('chai')
const sinon  = require('sinon')
const config = require('../../lib/config')
const fs     = require('../../lib/fs-as-promise')
/* eslint-enable no-multi-spaces */
chai.use(require('chai-as-promised'))
const expect = chai.expect

/* eslint-env mocha */
describe('lib/config', function () {
  it('is an object', () => expect(config).to.be.an('object'))

  describe('get()', function () {
    beforeEach(() => sinon.stub(fs, 'readFile').returns(Promise.resolve(JSON.stringify({
      user: 'john-doe',
      email: 'john@doe.com'
    }))))
    afterEach(() => fs.readFile.restore())

    it('is a function', () => expect(config.get).to.be.a('function'))

    it('accepts an array as argument', () => {
      return Promise.all([
        expect(config.get()).to.be.fulfilled,
        expect(config.get(['user', 'email'])).to.be.fulfilled
      ])
    })

    it('rejects when passed argument other than array', () => {
      return Promise.all(['foo', true, 123, null, [], {}].map(value => {
        return expect(config.get(value)).to.be.rejected
      }))
    })

    it('returns a promise', function () {
      const promises = []

      expect((() => {
        promises.push(config.get())
        return promises.slice(-1)[0]
      })()).to.be.a('promise')

      expect((() => {
        promises.push(config.get(['user', 'email']))
        return promises.slice(-1)[0]
      })()).to.be.a('promise')

      return Promise.all(promises)
    })
  })

  describe('set()', function () {
    beforeEach(() => {
      sinon.stub(fs, 'readFile').returns(Promise.resolve('{}'))
      sinon.stub(fs, 'writeFile')
    })
    afterEach(() => {
      fs.readFile.restore()
      fs.writeFile.restore()
    })

    it('is a function', () => expect(config.set).to.be.a('function'))

    it('requires an object argument', () => {
      return expect(config.set({foo: 'bar'})).to.be.fulfilled
    })

    it('rejects when calling without arguments', () => {
      return expect(config.set()).to.be.rejected
    })

    it('returns a promise', function () {
      let promise
      expect(promise = config.set({foo: 'bar'})).to.be.a('promise')
      return promise
    })

    /* eslint no-unused-expressions:0 */
    it('uses lib/fs-as-promise to write user configurations to disk', function () {
      return expect(config.set({foo: 'bar'})
        .then(() => {
          expect(fs.readFile.called).to.be.ok
          expect(fs.writeFile.withArgs(config.CONFIG_FILE, '{\n  "foo": "bar"\n}', 'utf8').called).to.be.ok
        })).to.be.fulfilled
    })
  })
})
