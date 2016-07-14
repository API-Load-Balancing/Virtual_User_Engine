'use strict';

var http = require('http');
var querystring = require('querystring');

//console.log('-------- New VM Start -----------------------');


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

// var k = 0;
// function setop() {
//     setTimeout(mylog, 200);
// }
//
// function mylog() {
//     if (k < 20) {
//         k++;
//         console.log('-----------------------------------------------------------');
//         console.log('id -> ', __sandboxID, '   k = ', k);
//         console.log('-----------------------------------------------------------');
//         sendReq();
//
//         setop();
//     }
// }

//setop();

function sendReq() {
    var req = http.request(options, (res) => {
        //console.log(`------------------------------------------------------------------`);
        //console.log(`STATUS: ${res.statusCode}`);
        //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            //console.log(`BODY: ${chunk}`);
            console.log('-----------------------------------------------------------');
            console.log('id -> ', __sandboxID);
            console.log('+++++++data in response.')
            console.log('-----------------------------------------------------------');

        });
        res.on('end', () => {

                 // sendReq();
//            console.log('No more data in response.')

        })
    });

    req.on('error', (e) => {
        //console.log(`problem with request: ${e.message}`);
    });


    req.write(postData);
    req.end();

    console.log('-----------------------------------------------------------');
    console.log('id -> ', __sandboxID);
    console.log('-----------------------------------------------------------');
}
//
//
// var k = 0;
sendReq();

function sendreq2() {
    var request = require('request');
    request('http://www.google.com', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('request module')
            //console.log(body) // Show the HTML for the Google homepage.


        }
    })
}

sendreq2();
