'use strict';

var child_process = require('child_process');


const util = require('util');
const os = require('os');

printMem();


for (var i=0; i<100; i++)
    child_process.fork('index.js');


printMem();

var count = 0;
var myInterval = setInterval(printMem, 5000);

function printMem() {
    console.log('--------------------------------------------');
    console.log('Os Total Mem = ', util.inspect(os.totalmem()));
    console.log('Os Free Mem = ', util.inspect(os.freemem()));
    console.log('Node Mem Info', util.inspect(process.memoryUsage()));
    console.log('--------------------------------------------');
    count++;
    if (count > 50) clearInterval(myInterval);
}