var http = require('http');
var querystring = require('querystring');


var postData = querystring.stringify({
    'msg': 'Hello World!'
});

var options = {
    hostname: 'www.google.com',
    port: 80,
    path: '/upload',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
    }
};


var req = http.request(options, (res) => {
    console.log(`------------------------------------------------------------------`);
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
       console.log('No more data in response.')
    })
});

req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
});

// write data to request body
req.write(postData);
req.end();






var request = require('request');
request('http://www.google.com', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body) // Show the HTML for the Google homepage.
    }
})




// var a = require('http');
// a.request = function() {
//     console.log('hello world');
// }


//
// var _ = require('lodash');
//
// var extfunc = function(k) {
//     var r = k*10;
//     console.log(r);
// }
//
// function Circ() {
//     this.me = this;
// }
//
// function Nested(y) {
//     this.y = y;
// }
//
// var a = {
//     x: 'a',
//     circ: new Circ(),
//     nested: new Nested('a'),
//     myfunc: extfunc
// };
//
// var b = _.cloneDeep(a);
//
// b.x = 'b';
// b.nested.y = 'b';
//
// console.log('----------------------------');
// console.log(a);
// console.log('----------------------------');
// console.log(b);