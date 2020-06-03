//Type testing

//Dependencies
//Npm Modules
const chai = require('chai');
const asserttype = require('chai-asserttype');

//My Modules
const {
    Types,
    interface,
    Interface,
    arrayOf,
    keyValueObject,
    Overloader,
    typedFunction,
    either } = require("../type");
const expectError = require("./expect-error");

chai.use(asserttype);
const expect = chai.expect;

//Test
function test() {
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
                        expect(Types.NUMBER(94)).to.be.false;
                    });
                    it("Math.PI is number", () => {
                        expect(Types.NUMBER(Math.PI)).to.be.false;
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
                describe("positive number", () => {
                    it("24.5 is good", () => {
                        expect(Types.POSITIVE_NUMBER(24.5)).to.be.false;
                    });
                    it("3 is good", () => {
                        expect(Types.POSITIVE_NUMBER(3)).to.be.false;
                    });
                    it("-2.3 is not good", () => {
                        expect(Types.POSITIVE_NUMBER(-2.3)).to.be.string();
                    });
                    it("0 is not good", () => {
                        expect(Types.POSITIVE_NUMBER(0)).to.be.string();
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
                describe("positive integer", () => {
                    it("9 is good", () => {
                        expect(Types.POSITIVE_INTEGER(9)).to.be.false;
                    });
                    it("-2 is not good", () => {
                        expect(Types.POSITIVE_INTEGER(-2)).to.be.string();
                    });
                    it("0 is not good", () => {
                        expect(Types.POSITIVE_INTEGER(0)).to.be.string();
                    });
                    it("0.3 is not good", () => {
                        expect(Types.POSITIVE_INTEGER(0.3)).to.be.string();
                    });
                    it("-5.5 is not good", () => {
                        expect(Types.POSITIVE_INTEGER(5.5)).to.be.string();
                    });
                });
                describe("integer", () => {
                    it("9 is good", () => {
                        expect(Types.INTEGER(9)).to.be.false;
                    });
                    it("-2 is good", () => {
                        expect(Types.INTEGER(-2)).to.be.false;
                    });
                    it("0 is good", () => {
                        expect(Types.INTEGER(0)).to.be.false;
                    });
                    it("0.3 is not good", () => {
                        expect(Types.INTEGER(0.3)).to.be.string();
                    });
                    it("-5.5 is not good", () => {
                        expect(Types.INTEGER(5.5)).to.be.string();
                    });
                });
                describe("non negative integer", () => {
                    it("24.5 is not good", () => {
                        expect(Types.NON_NEGATIVE_INTEGER(24.5)).to.be.string();
                    });
                    it("3 is good", () => {
                        expect(Types.NON_NEGATIVE_INTEGER(3)).to.be.false;
                    });
                    it("-2.3 is not good", () => {
                        expect(Types.NON_NEGATIVE_INTEGER(-2.3)).to.be.string();
                    });
                    it("-10 is not good", () => {
                        expect(Types.NON_NEGATIVE_INTEGER(-10)).to.be.string();
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
                describe("rgb intensity", () => {
                    it("0 is good", () => {
                        expect(Types.RGB_INTENSITY(0)).to.be.false;
                    });
                    it("255 is good", () => {
                        expect(Types.RGB_INTENSITY(255)).to.be.false;
                    });
                    it("234.34 is good", () => {
                        expect(Types.RGB_INTENSITY(234.34)).to.be.false;
                    });
                    it("-2 is bad", () => {
                        expect(Types.RGB_INTENSITY(-2)).to.be.string();
                    });
                    it("290 is bad", () => {
                        expect(Types.RGB_INTENSITY(290)).to.be.string();
                    });
                });
            });
            describe("string", () => {
                describe("any string", () => {
                    it("'hi' is string", () => {
                        expect(Types.STRING("hi")).to.be.false;
                    });
                    it("2 is not string", () => {
                        expect(Types.STRING(2)).to.be.string();
                    });
                    it("empty string is string", () => {
                        expect(Types.STRING("")).to.be.false;
                    });
                    it("object is not string", () => {
                        expect(Types.STRING({})).to.be.string();
                    });
                });
                describe("color", () => {
                    it("red is color", () => {
                        expect(Types.COLOR("red")).to.be.false;
                    });
                    it("purple is color", () => {
                        expect(Types.COLOR("purple")).to.be.false;
                    });
                    it("mediumSeaGreen is color", () => {
                        expect(Types.COLOR("mediumSeaGreen")).to.be.false;
                    });
                    it("yuck is not color", () => {
                        expect(Types.COLOR("yuck")).to.be.string();
                    });
                    it("hexadecimal is color", () => {
                        expect(Types.COLOR("#eeff00")).to.be.false;
                    });
                });
            });
            describe("boolean", () => {
                describe("any boolean", () => {
                    it("true is boolean", () => {
                        expect(Types.BOOLEAN(true)).to.be.false;
                    });
                    it("false is boolean", () => {
                        expect(Types.BOOLEAN(false)).to.be.false;
                    });
                    it("1 == 3 + 2 is boolean", () => {
                        expect(Types.BOOLEAN(1 == 3 + 2)).to.be.false;
                    });
                    it("1 is not boolean", () => {
                        expect(Types.BOOLEAN(1)).to.be.string();
                    });
                    it("'hi' is not boolean", () => {
                        expect(Types.BOOLEAN("hi")).to.be.string();
                    });
                });
                describe("truthy", () => {
                    it("1 is truthy", () => {
                        expect(Types.TRUTHY(1)).to.be.false;
                    });
                    it("0 is not truthy", () => {
                        expect(Types.TRUTHY(0)).to.be.string();
                    });
                    it("40 is truthy", () => {
                        expect(Types.TRUTHY(40)).to.be.false;
                    });
                    it("'hi' is truthy", () => {
                        expect(Types.TRUTHY("hi")).to.be.false;
                    });
                    it("empty string is not truthy", () => {
                        expect(Types.TRUTHY("")).to.be.string();
                    });
                });
                describe("falsy", () => {
                    it("1 is not falsy", () => {
                        expect(Types.FALSY(1)).to.be.string();
                    });
                    it("0 is falsy", () => {
                        expect(Types.FALSY(0)).to.be.false;
                    });
                    it("40 is not falsy", () => {
                        expect(Types.FALSY(40)).to.be.string();
                    });
                    it("'hi' is not falsy", () => {
                        expect(Types.FALSY("hi")).to.be.string();
                    });
                    it("empty string is falsy", () => {
                        expect(Types.FALSY("")).to.be.false;
                    });
                });
            });
            describe("function", () => {
                it("Math.round is function", () => {
                    expect(Types.FUNCTION(Math.round)).to.be.false;
                });
                it("variable function is function", () => {
                    var f = function () {
                        console.log("I'm a variable function.");
                    };
                    expect(Types.FUNCTION(f)).to.be.false;
                });
                it("function function is function", () => {
                    function f() {
                        console.log("I'm a function function");
                    };
                    expect(Types.FUNCTION(f)).to.be.false;
                });
                it("arrow function is function", () => {
                    const f = () => "I'm an arrow function";
                    expect(Types.FUNCTION(f)).to.be.false;
                });
                it("object is not a function", () => {
                    expect(Types.FUNCTION({})).to.be.string();
                });
                it("'hi' is not a function", () => {
                    expect(Types.FUNCTION("hi")).to.be.string();
                });
                it("undefined is not a function", () => {
                    expect(Types.FUNCTION(undefined)).to.be.string();
                });
            });
            describe("object", () => {
                describe("any object", () => {
                    it("empty object is object", () => {
                        expect(Types.OBJECT({})).to.be.false;
                    });
                    it("object with properties is object", () => {
                        var o = { a: true, b: "Boom" };
                        expect(Types.OBJECT(o)).to.be.false;
                    });
                    it("class instance is object", () => {
                        class C {
                            constructor() {
                                this.m = false;
                                this.a = 2;
                            }
                            m() {
                                this.m = true;
                            }
                        }
                        expect(Types.OBJECT(new C())).to.be.false;
                    });
                    it("function is not object", () => {
                        function f() {
                            console.log("I'm a function.");
                        };
                        f.property = 0;
                        expect(Types.OBJECT(f)).to.be.string();
                    });
                    it("'hi' is not object", () => {
                        expect(Types.OBJECT("hi")).to.be.string();
                    });
                    it("array is an object", () => {
                        expect(Types.OBJECT([])).to.be.false;
                    });
                });
                describe("array", () => {
                    it("empty object is not array", () => {
                        expect(Types.ARRAY({})).to.be.string();
                    });
                    it("object with properties is not array", () => {
                        var o = { a: true, b: "Boom" };
                        expect(Types.ARRAY(o)).to.be.string();
                    });
                    it("class instance is not array", () => {
                        class C {
                            constructor() {
                                this.m = false;
                                this.a = 2;
                            }
                            m() {
                                this.m = true;
                            }
                        }
                        expect(Types.ARRAY(new C())).to.be.string();
                    });
                    it("function is not array", () => {
                        function f() {
                            console.log("I'm a function.");
                        };
                        f.property = 0;
                        expect(Types.ARRAY(f)).to.be.string();
                    });
                    it("'hi' is not array", () => {
                        expect(Types.ARRAY("hi")).to.be.string();
                    });
                    it("empty array is array", () => {
                        expect(Types.ARRAY([])).to.be.false;
                    });
                    it("not empty array is array", () => {
                        expect(Types.ARRAY(["not", "empty"])).to.be.false;
                    });
                    it("new Array() is array", () => {
                        expect(Types.ARRAY(new Array())).to.be.false;
                    });
                });
            });
            describe("key", () => {
                it("Symbol() is key", () => {
                    var s = Symbol();
                    expect(Types.KEY(s)).to.be.false;
                });
                it("'hi' is key", () => {
                    expect(Types.KEY("hi")).to.be.false;
                });
                it("empty string is key", () => {
                    expect(Types.KEY("")).to.be.false;
                });
                it("30 is key", () => {
                    expect(Types.KEY(30)).to.be.false;
                });
                it("0 is key", () => {
                    expect(Types.KEY(0)).to.be.false;
                });
                it("{} is not key", () => {
                    expect(Types.KEY({})).to.be.string();
                });
                it("undefined is not key", () => {
                    expect(Types.KEY(undefined)).to.be.string();
                });
                it("function is not key", () => {
                    var f = () => 42;
                    expect(Types.KEY(f)).to.be.string();
                });
            });
            describe("type", () => {
                it("Types.NUMBER is type", () => {
                    expect(Types.TYPE(Types.NUMBER)).to.be.false;
                });
                it("Types.TYPE is type", () => {
                    expect(Types.TYPE(Types.TYPE)).to.be.false;
                });
                it("custom type function is type", () => {
                    const happyType = a => typeof a === 'string' && a.includes("happy") ? false : "is not happy.";
                    expect(Types.TYPE(happyType)).to.be.false;
                });
                it("true is not type", () => {
                    expect(Types.TYPE(true)).to.be.string();
                });
                it("'hi' is not type", () => {
                    expect(Types.TYPE("hi")).to.be.string();
                });
                it("{} is not type", () => {
                    expect(Types.TYPE({})).to.be.string();
                });
            });
        });
        describe("interface", () => {
            it("no keys", () => {
                var interfaceType = interface({});
                expect(interfaceType).to.be.function();
                expect(Types.TYPE(interfaceType)).to.be.false;
                expect(interfaceType({ a: false })).to.be.false;
            });
            it("required", () => {
                var interfaceType = interface({
                    a: {
                        type: Types.BOOLEAN,
                        required: true
                    },
                    b: {
                        type: Types.STRING
                    }
                });
                expect(interfaceType).to.be.function();
                expect(Types.TYPE(interfaceType)).to.be.false;
                expect(interfaceType({ a: false, b: "hello" })).to.be.false;
                expect(interfaceType({ a: 34, b: "a string" })).to.be.string();
                expect(interfaceType({ a: true })).to.be.false;
                expect(interfaceType({ b: "a string" })).to.be.string();
                expect(interfaceType({})).to.be.string();
            });
            it("optional", () => {
                var interfaceType = interface({
                    a: {
                        type: Types.BOOLEAN,
                        required: false
                    },
                    b: {
                        type: Types.STRING
                    }
                });
                expect(interfaceType).to.be.function();
                expect(Types.TYPE(interfaceType)).to.be.false;
                expect(interfaceType({ a: false, b: "hello" })).to.be.false;
                expect(interfaceType({ a: 34, b: "a string" })).to.be.string();
                expect(interfaceType({ a: true })).to.be.false;
                expect(interfaceType({ b: "a string" })).to.be.false;
                expect(interfaceType({})).to.be.false;
            });
            it("not extendible", () => {
                var interfaceType = interface({
                    a: {
                        type: Types.BOOLEAN
                    }
                }, false);
                expect(interfaceType({})).to.be.false;
                expect(interfaceType({ a: false })).to.be.false;
                expect(interfaceType({ a: 34 })).to.be.string();
                expect(interfaceType({ b: true })).to.be.string();
            });
        });
        describe("Interface", () => {
            describe("chain", () => {
                var interfaceType = new Interface(false)
                    .key("a", Types.ANY, true)
                    .optional("b", Types.BOOLEAN)
                    .required("c", Types.COLOR)
                    .toType();

                expect(Types.TYPE(interfaceType)).to.be.false;
                expect(interfaceType({})).to.be.string();
                expect(interfaceType({ z: true, a: false, b: true, c: "orange" })).to.be.string();
                expect(interfaceType({ a: false, b: true, c: "orange" })).to.be.false;
                expect(interfaceType({ a: false, c: "orange" })).to.be.false;
            });
            describe("no chain", () => {
                var interfaceType = new Interface(false);
                interfaceType.key("a", Types.ANY, true);
                interfaceType.optional("b", Types.BOOLEAN);
                interfaceType.required("c", Types.COLOR);
                interfaceType = interfaceType.toType();

                expect(Types.TYPE(interfaceType)).to.be.false;
                expect(interfaceType({})).to.be.string();
                expect(interfaceType({ z: true, a: false, b: true, c: "orange" })).to.be.string();
                expect(interfaceType({ a: false, b: true, c: "orange" })).to.be.false;
                expect(interfaceType({ a: false, c: "orange" })).to.be.false;
            });
        });
        describe("arrayOf", () => {
            it("good call", () => {
                var arrayOfNumbers = arrayOf(Types.NUMBER);
                expect(arrayOfNumbers([])).to.be.false;
                expect(arrayOfNumbers([234, 2342])).to.be.false;
                expect(arrayOfNumbers([0, 30, Math.PI, 343, 1])).to.be.false;
                expect(arrayOfNumbers([3423, "hi", 34])).to.be.string();
                expect(arrayOfNumbers([1, 1, 1, "1", 1])).to.be.string();
            });
            it("bad call", () => {
                expectError(() => {
                    var arrayOfNumbers = arrayOf(34);
                });
                expectError(() => {
                    var arrayOfTruthy = arrayOf(true);
                });
            });
        });
        describe("keyValueObject", () => {
            it("good call", () => {
                var type = keyValueObject(Types.TRUTHY);
                expect(type({})).to.be.false;
                expect(type({ key: 3 })).to.be.false;
                expect(type({ a: true, b: "yes" })).to.be.false;
                expect(type({ good: true, bad: 0 })).to.be.string();
                expect(type(34)).to.be.string();
                expect(type("hi")).to.be.string();
            });
            it("bad call", () => {
                var threw = false;
                expectError(() => {
                    var type = keyValueObject("number");
                });
            });
        });
        describe("overloader", () => {
            it("no overloads", () => {
                var threw = false;
                var f = new Overloader().overloader;
                expectError(() => {
                    f();
                });
            });
            it("optional parameter", () => {
                var f = new Overloader()
                    .overload([{ type: Types.BOOLEAN }, { type: Types.STRING, optional: true }], function () {
                        return true;
                    });

                expect(f.overloader(false)).to.be.true;
                expect(f.overloader(true, "hi")).to.be.true;
                var threw = false;
                expectError(() => {
                    f.overloader(true, 2);
                });
                expectError(() => {
                    f.overloader();
                });
            });
            it("binding", () => {
                var o = new Overloader()
                    .overload([{ type: Types.STRING }, { type: Types.BOOLEAN, optional: true }], function (s, double) {
                        return this.a + " " + s + (double ? " " + s : "");
                    })
                    .overload([{ type: Types.NUMBER }, { type: Types.BOOLEAN, optional: true }], function (n, double) {
                        return this.a + n * (double ? 2 : 1);
                    });
                o.bind({ a: "hi" });
                expect(o.overloader("more", true)).to.be.string("a", "hi more more");
                expect(o.overloader("more")).to.be.string("a", "hi more");
                o.bind({ a: 5 });
                expect(o.overloader(5, true)).to.equal(15);
                expect(o.overloader(5)).to.equal(10);
                var threw = false;
                expectError(() => {
                    o.overloader();
                });
            });
        });
        describe("typedFunction", () => {
            it("0 parameters", () => {
                var f = typedFunction([], function () {
                    return true;
                });
                expect(f()).to.be.true;
            });
            it("optional and default parameters", () => {
                var f = typedFunction([
                    {
                        name: "a",
                        type: Types.NUMBER,
                        default: 10
                    },
                    {
                        name: "b",
                        type: Types.NUMBER,
                        default: 1,
                        optional: true
                    },
                    {
                        name: "c",
                        type: Types.STRING,
                        optional: true
                    }
                ], function (a, b, c = "") {
                    return a * b + c;
                });
                expect(f(5)).to.be.string("5");
                expect(f(5, undefined, "hi")).to.be.string("5hi");
                expect(f(5, 10)).to.be.string("50");
            });
        });
        describe("either", () => {
            it("0 types", () => {
                expectError(() => {
                    var t = either();
                });
            });
            it("1 type", () => {
                var t = either(Types.BOOLEAN);
                expect(t(true)).to.be.false;
                expect(t("hi")).to.be.string();
            });
            it("2 types", () => {
                var t = either(Types.INTEGER, Types.NON_NEGATIVE_NUMBER);
                expect(t(-2)).to.be.false;
                expect(t(-3.4)).to.be.string();
                expect(t(50)).to.be.false;
                expect(t(0.49)).to.be.false;
                expect(t(0)).to.be.false;
            });
            it("4 types", () => {
                var t = either(Types.NUMBER, Types.STRING, Types.ARRAY, Types.FALSY);
                expect(t(2)).to.be.false;
                expect(t("hi")).to.be.false;
                expect(t(["this", "is", "a", "special", "object"])).to.be.false;
                expect(t(NaN)).to.be.false;
                expect(t()).to.be.false;
                expect(t({})).to.be.string();
                expect(t(new Date())).to.be.string();
                expect(t(() => false)).to.be.string();
                expect(t(true)).to.be.string();
                expect(t(false)).to.be.false;
            })
        });
    });
};

//Export the module
module.exports = test;