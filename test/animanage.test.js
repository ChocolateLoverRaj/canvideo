//Animanage testing

//Dependencies
//Npm Modules
const chai = require('chai');

//My Modules
const { animanage } = require("../animations/animanage");
const { Types } = require("../type");
const expectError = require("./expect-error");
const Animation = require("../animations/animation");

const expect = chai.expect;

//Test function
function test() {
    describe("animanage.js", () => {
        it("methods to bind and set", () => {
            class O {
                opposite() {
                    return !this.a;
                }
            };
            var o = new O();
            animanage(o, { a: { type: Types.BOOLEAN, initial: true } }, ["opposite"]);
            o.set(5, {a: false});
            expectError(() => {
                o.set(5, {a: 2});
            });
            expectError(() => {
                o.set(-5, {});
            });
            expectError(() => {
                o.set(5, {b: 2});
            });
            expect(o.at(3).opposite()).to.be.false;
            expect(o.at(7).opposite()).to.be.true;
            expectError(() => {
                o.at(-3);
            });
        });
        it("animating", () => {
            var o = {};
            animanage(o, {
                a: {
                    type: Types.NUMBER,
                    initial: 0
                },
                b: {
                    type: Types.NUMBER,
                    initial: 0
                }
            }, []);
            o.animate(5, 5, new Animation({ a: 0 }, { a: 10 }));
            o.animate(5, 5, new Animation({ b: 10 }, { b: 5 }));
            expect(o.at(0)).to.include({ a: 0, b: 0 });
            expect(o.at(4)).to.include({ a: 0, b: 0 });
            expect(o.at(5)).to.include({ a: 0, b: 10 });
            expect(o.at(7.5)).to.include({ a: 5, b: 7.5 });
        });
    });
};

//Export the module
module.exports = test;