'use strict';


var _ = require('lodash');
// var u = require('util');
// var S = require('stream');

//var S = require('events');

// console.log(uu);
// console.log('-----------------------------------');
// console.log(util);

// console.log('-----------------------------------');
// console.log(S);
// console.log('-----------------------------------');
// console.log(Stream);


function Circ() {
    this.me = this;
}

function Nested(y) {
    this.y = y;
}

var h = setImmediate(console.log, 'hello');
console.log(h.constructor);
console.log(h.constructor.toString());

//
// var a = {
//     x: 'a',
//     circ: new Circ(),
//     nested: new Nested('a')
// };
//
//
// var b = completeAssign(a);
// var c = _.cloneDeep(a);
//
//
// b.x = 'b';
// b.nested.y = 'b';
//
// c.x = 'c';
// c.nested.y = 'c';
//
// console.log(a);
// console.log('----------------');
// console.log(b);
// console.log('----------------');
// console.log(c);
// console.log('----------------');
//
//
//
//
// // function Readable() {
// //
// //     this.readable = true;
// //     Stream.call(this);
// // }
// // util.inherits(Readable, Stream);
// //
// // console.log(Readable);
// //
// // Readable.prototype.push = function (chunk, encoding) {
// //     return 10;
// // };
// // // Unshift should *always* be something directly out of read()
// // Readable.prototype.unshift = function (chunk) {
// //     return 20;
// // };
// // Readable.prototype.isPaused = function () {
// //     return 30;
// // };
//
//
//
//
//
// function completeAssign(source) {
//     var target = {}
//
//         let descriptors = Object.keys(source).reduce((descriptors, key) => {
//             descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
//             return descriptors;
//         }, {});
//         // by default, Object.assign copies enumerable Symbols too
//         Object.getOwnPropertySymbols(source).forEach(sym => {
//             let descriptor = Object.getOwnPropertyDescriptor(source, sym);
//             if (descriptor.enumerable) {
//                 descriptors[sym] = descriptor;
//             }
//         });
//         Object.defineProperties(target, descriptors);
//
//     return target;
// }
