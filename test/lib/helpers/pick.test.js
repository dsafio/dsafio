/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

/* eslint-disable no-multi-spaces */
const chai = require("chai");
const pick = require("../../../lib/helpers/pick");
/* eslint-enable no-multi-spaces */

const expect = chai.expect;

/* eslint-env mocha */
describe("lib/helpers/pick", function() {
  it("is a function", () => {
    expect(pick).to.be.a("function");
  });

  it("requires the `source` object argument", () => {
    expect(() => pick({})).to.not.throw();
    ["foo", 123, true, null].forEach(value => {
      expect(() => pick(value)).to.throw();
    });
  });

  it("accepts the `keys` array argument", () => {
    expect(() => pick({}, [])).to.not.throw();
  });

  it("throws when `keys` is not an array", () => {
    ["foo", 123, true, null, {}].forEach(value => {
      expect(() => pick({}, value)).to.throw();
    });
  });

  it("returns an object", () => {
    expect(pick({})).to.be.an("object");
    expect(pick({}, [])).to.be.an("object");
  });

  it("picks `keys` from `source`", function() {
    const source = {
      username: "johndoe",
      password: "idontremember"
    };
    const expected = {
      username: "johndoe"
    };

    expect(pick(source, ["username"])).to.deep.equal(expected);
  });
});
