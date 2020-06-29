//Animation testing

//Dependencies
//Npm Modules
const chai = require('chai');

//My Modules
const expectError = require("./expect-error");
const Animation = require("../animations/animation");

const expect = chai.expect;

//Test function
function test() {
    describe("animate.js", () => {
        describe("features", () => {
            it("regular", () => {
                var a = new Animation({ a: 50, b: 0 }, { a: 0, b: 50 });
                expect(a.calculate(0)).to.include({ a: 50, b: 0 });
                expect(a.calculate(0.5)).to.include({ a: 25, b: 25 });
                expect(a.calculate(1)).to.include({ a: 0, b: 50 });
            });
            it("reverse", () => {
                var a = new Animation({ a: 50, b: 0 }, { a: 0, b: 50 })
                    .reverse()
                expect(a.calculate(0)).to.include({ a: 50, b: 0 });
                expect(a.calculate(0.25)).to.include({ a: 25, b: 25 });
                expect(a.calculate(0.5)).to.include({ a: 0, b: 50 });
                expect(a.calculate(0.75)).to.include({ a: 25, b: 25 });
                expect(a.calculate(1)).to.include({ a: 50, b: 0 });
            });
        });
        describe("errors", () => {
            it("extra property", () => {
                expectError(() => {
                    new Animation({a: 59, b: 3}, {b: 34});
                });
                expectError(() => {
                    new Animation({b: 3}, {b: 34, c: 0});
                });
            });
            it("non number property", () => {
                expectError(() => {
                    new Animation({a: true}, {b: 34});
                });
                expectError(() => {
                    new Animation({b: 3}, {b: "3"});
                });
            });
        });
    });
};

//Export the module
module.exports = test;