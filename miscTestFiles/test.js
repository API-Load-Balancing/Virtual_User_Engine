(function (exports, require, module, __filename, __dirname, maxTimeout, emitOnStart, emitOnEnd, eventChannel) {

    'use strict'

    var scriptStartTime = new Date();

    var __endOfCodeReached__ = false;
    var _myActiveHandlers = 0;

    // Script Run Started
    emitOnStart();










    var userScriptRunFunction = function () {



    }

    userScriptRunFunction();

    __endOfCodeReached__ = true;
    incActiveHandlers();
    decActiveHandlers();
});

