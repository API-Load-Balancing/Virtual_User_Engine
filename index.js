// This is a test file
// to run testScript.js

'use strice';

var fs = require('fs');
var VUE = require('./virtual_user_engine');






var vue = [];
var saveReqTime = new WeakMap();
for (var i = 0; i < 10; i++) {
    vue[i] = new VUE();
    vue[i].requireOptions.addBlacklist('fs');
    vue[i].requireOptions.addBlacklist('process');
    vue[i].requireOptions.addBlacklist('cluster');
    vue[i].requireOptions.addOnBeforeRequire(function (moduleName) { console.log(i, moduleName); });

    vue[i].requestOptions.timeout = i*30;
    vue[i].requestOptions.addOnRequest(function (req, options) {
        var myTempDate = new Date();
        saveReqTime.set(req, myTempDate.getTime());
        console.log('req Start Time: ', i, ' : ',  myTempDate.toString());
    });

    vue[i].requestOptions.addOnResponse(function (req, res) {
        var myTempDate = new Date();
        var OperationTime = myTempDate.getTime() - saveReqTime.get(req);
        saveReqTime.delete(req)
        console.log('response time : ',  OperationTime);
    });


    vue[i].getCodeFromFile('./testScript.js');

    vue[i].prepareToRun();
}




for (var i = 0; i < 10; i++) {
    console.log('User ' + i + ' run ...');
    vue[i].run();
}
