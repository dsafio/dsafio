/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

/* eslint-disable no-multi-spaces */
const chai      = require('chai')
const got       = require('got')
const sinon     = require('sinon')
const challenge = require('../../lib/challenge')
const registry  = require('../../lib/registry')
/* eslint-enable no-multi-spaces */

chai.use(require('chai-as-promised'))
const expect = chai.expect

const FAKE_CHALLENGES = (function () {
  const fakeMeAFile = file => ({
    name: file,
    content: Buffer.from(`${file} content`).toString('base64')
  })
  const fakeMeAChallenge = challengeKey => ({
    title: challengeKey,
    files: ['index.js', 'readme.md', 'test.js'].map(fakeMeAFile)
  })

  return () => ['hello-world', 'fizz-buzz', 'foo-bar'].map(fakeMeAChallenge)
})()

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
describe('lib/challenge', function () {
  it('is an object', () => expect(challenge).to.be.an('object'))

  describe('fetch()', function () {
    beforeEach(() => {
      sinon.stub(got, 'get')
        .callsFake(url => Promise.resolve({
          body: JSON.stringify({
            name: url.substr(url.lastIndexOf('/') + 1),
            content: Buffer.from('<content>').toString('base64')
          })
        }))
      sinon.stub(registry, 'get')
        .callsFake(() => Promise.resolve({
          challenges: FAKE_CHALLENGES().reduce((challenges, challenge) => {
            return Object.assign(challenges, { [challenge.title]: challenge })
          }, {})
        }))
    })
    afterEach(() => {
      registry.get.restore()
      got.get.restore()
    })

    it('is a function', () => expect(challenge.fetch).to.be.a('function'))

    it('accepts an array as argument', () => {
      return Promise.all([
        expect(challenge.fetch()).to.be.fulfilled,
        expect(challenge.fetch(['hello-world'])).to.be.fulfilled
      ])
    })

    it('rejects when passed argument other than array', () => {
      return Promise.all(['foo', true, 123, null, [], {}].map(value => {
        expect(challenge.fetch(value)).to.be.rejected
      }))
    })

    it('rejects unknown challenge keys', () => {
      return expect(challenge.fetch(['unknown'])).to.be.rejected
    })

    it('returns a promise', function () {
      const promises = []

      expect((() => {
        promises.push(challenge.fetch())
        return promises.slice(-1)[0]
      })()).to.be.a('promise')

      expect((() => {
        promises.push(challenge.fetch(['hello-world']))
        return promises.slice(-1)[0]
      })()).to.be.a('promise')

      return Promise.all(promises)
    })

    it('resolves with a list of challenges', () => {
      return challenge.fetch(['hello-world'])
        .then(challenges => {
          expect(challenges).to.be.an('array').that.is.not.empty
          expect(challenges.length).to.equal(1)
        })
    })

    describe('the challenges list', function () {
      it('has all challenges if no arguments are passed', () => {
        return expect(challenge.fetch())
          .to.eventually.be.an('array')
          .that.is.not.empty
      })

      it('has only a subset of challenges if keys are passed', function () {
        return challenge.fetch(['hello-world'])
          .then(challenges => {
            expect(challenges).to.be.an('array').that.is.not.empty
            expect(challenges.length).to.equal(1)
          })
      })
    })

    describe('each challenge', function () {
      it('has `title` and `files` keys', () => {
        return challenge.fetch(['hello-world'])
          .then(challenges => challenges[0])
          .then(challenge => expect(challenge)
            .to.be.an('object')
            .that.has.all.keys('title', 'files'))
      })

      it('has a list of files', () => {
        return challenge.fetch(['hello-world'])
          .then(challenges => challenges[0])
          .then(challenge => {
            expect(challenge.files)
              .to.be.an('array')
              .that.is.not.empty

            challenge.files.forEach(file => {
              expect(file)
                .to.be.an('object')
                .that.has.all.keys('name', 'content')
            })
          })
      })

      it('has files with `name` and `content` keys', () => {
        return challenge.fetch(['hello-world'])
          .then(challenges => challenges[0])
          .then(challenge => challenge.files)
          .then(files => {
            files.forEach(file => {
              expect(file.name).to.be.a('string')
              expect(file.content).to.be.a('string')
            })
          })
      })
    })

    describe('the second parameter, `options`', function () {
      it('accepts an object as argument', () => {
        return Promise.all([]
          .concat(expect(challenge.fetch(undefined, {})).to.be.fulfilled)

          .concat(['foo', 123, true, [], () => {}].map(value => {
            return expect(challenge.fetch(undefined, value)).to.be.rejected
          })))
      })
    })
  })
})
