'use strict';


var vue = require('./virtual_user_engine');
vue.getCodeFromFile('./testscript.js');
vue.timeout = 3000;
vue.requireOptions.addPath(['./node_modules']);
vue.on('console.log', function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('sandbox ID = ')
    //console.log.apply(null, args.slice(0));
});

vue.on('vmEnd', function(sandID, rTime) {
//    console.log(`----------------------------------------------------------------`);
    console.log(`ID = ${sandID}  Has Ended with runtime of ${rTime}`);
    setImmediate(vue.run,c[sandID]);

//    console.log(`----------------------------------------------------------------`);
});
vue.on('vmEndofCode', function(sandID, rTime) {
    console.log(`ID = ${sandID}  End of code reached -- runtime = ${rTime}`);
});

var c = [];
c[1] = vue.getFullContext(1);
c[2] = vue.getFullContext(2);
c[3] = vue.getFullContext(3);


vue.run(c[1]);
vue.run(c[2]);
vue.run(c[3]);


//
process.on('uncaughtException', (err) => {
    console.log(`Caught exception: ${err}`);
    console.log(`Code = `, err.code);
});
