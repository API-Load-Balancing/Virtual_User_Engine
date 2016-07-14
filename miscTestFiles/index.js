// This is a test file
// to run testScript.js

'use strice';

var fs = require('fs');
var VUE = require('./virtual_user_engine');
var path = require('path');


var reqcount = 0;
var rescount = 0;
var timeoutCount = 0
var totWrite = 0;
var totRead = 0;


var myCode = fs.readFileSync(path.resolve('./testScript.js'), 'utf8');

//console.log(myCode);


var vue = [];
var saveReqTime = new WeakMap();
for (var i = 0; i < vuTot; i++) {
    vue[i] = new VUE();
    vue[i].requireOptions.addBlacklist('process');
    vue[i].requireOptions.addBlacklist('cluster');
    vue[i].requireOptions.addPath('./node_modules');

    vue[i].requestOptions.timeout = 2000;
    vue[i].requestOptions.addOnRequest(function (req, options) {

        req.setTimeout(60000, function() {
            req.abort()
            timeoutCount++;
            rescount++;
            if (rescount % 1000 === 0) {
                console.log(rescount,    reqcount, timeoutCount);
            }
        });


        reqcount++;
        if (reqcount === 1000) {

            console.log('--------------------------------------------');
            console.log('--------------------------------------------');
            console.log('      1000 Request Send   ');
            console.log('--------------------------------------------');
            console.log('--------------------------------------------');
        }

    });

    vue[i].requestOptions.addOnResponse(function (req, res) {

        rescount++;
        if (rescount % 1000 === 0) {
            console.log(rescount,    reqcount, timeoutCount);
        }
    });


    //vue[i].getCodeFromFile('./testScript.js');
    vue[i].getCodeFromString(myCode);
    vue[i].setCodeFileName('./testScript.js')
    vue[i].prepareToRun();
}

var TotalActiveScripts = 0;

vue[0].on('Start', function() {
    TotalActiveScripts++;
});

vue[0].on('End', function(ExecTime) {
    TotalActiveScripts--;
    console.log('Total Active Scripts', TotalActiveScripts);
});

for (var i = 0; i < 10; i++) vue[0].run();
