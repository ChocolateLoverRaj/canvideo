//All testing

//Dependencies
//Node.js Modules
const assert = require('assert');

//Npm Modules
const chai = require('chai');
const asserttype = require('chai-asserttype');
chai.use(asserttype);

//My Modules
const { Types } = require("../type");

//Get methods
const expect = chai.expect;

describe("type.js", () => {
    describe("Types", () => {
        describe("any", () => {
            it("34 is any", () => {
                expect(Types.ANY(34)).to.be.false;
            });
            it("'hi' is any", () => {
                expect(Types.ANY("hi")).to.be.false;
            });
            it("false is any", () => {
                expect(Types.ANY(false)).to.be.false;
            });
            it("null is any", () => {
                expect(Types.ANY(null)).to.be.false;
            });
            it("explicit undefined is any", () => {
                expect(Types.ANY(undefined)).to.be.false;
            });
            it("implicit undefined is any", () => {
                var o = {};
                expect(Types.ANY(o.nonExistentProperty)).to.be.false;
            });
        });
        describe("number", () => {
            describe("any number", () => {
                it("94 is number", () => {
                    assert.equal(Types.NUMBER(94), false);
                });
                it("Math.PI is number", () => {
                    assert.equal(Types.NUMBER(Math.PI), false);
                });
                it("NaN is a number.", () => {
                    expect(Types.NUMBER(NaN)).to.be.false;
                });
                it("'hi' is not a number", () => {
                    expect(Types.NUMBER("hi")).to.be.string();
                });
                it("undefined is not a number", () => {
                    expect(Types.NUMBER(undefined)).to.be.string();
                });
                it("object is not a number", () => {
                    expect(Types.NUMBER({})).to.be.string();
                });
            });
            describe("non negative number", () => {
                it("24.5 is good", () => {
                    expect(Types.NON_NEGATIVE_NUMBER(24.5)).to.be.false;
                });
                it("3 is good", () => {
                    expect(Types.NON_NEGATIVE_NUMBER(3)).to.be.false;
                });
                it("-2.3 is not good", () => {
                    expect(Types.NON_NEGATIVE_NUMBER(-2.3)).to.be.string();
                });
                it("-10 is not good", () => {
                    expect(Types.NON_NEGATIVE_NUMBER(-10)).to.be.string();
                });
            });
            describe("unit interval", () => {
                it("0 is good", () => {
                    expect(Types.UNIT_INTERVAL(0)).to.be.false;
                });
                it("1 is good", () => {
                    expect(Types.UNIT_INTERVAL(1)).to.be.false;
                });
                it("0.82 is good", () => {
                    expect(Types.UNIT_INTERVAL(0.82)).to.be.false;
                });
                it("-1 is not good", () => {
                    expect(Types.UNIT_INTERVAL(-1)).to.be.string();
                });
                it("99 is not good", () => {
                    expect(Types.UNIT_INTERVAL(99)).to.be.string();
                });
            });
        });
    });
});