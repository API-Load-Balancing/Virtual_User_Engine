(function (exports, require, module, __filename, __dirname) {

    _ActiveHandlers = 0;
    __endOfCodeReached__ = false;
    __scriptStartTime = new Date();
    __timeoutHappen = false;

    // Script Run Started
    __emitOnStart();

    setTimeout(function () {
        __timeoutHappen = true;
    }, __timeout);

    var userScriptRunFunction = function () {

        console.log('hello world 123456789');
        _ActiveHandlers++;
        console.log(_ActiveHandlers);
        console.log(global);
    }

    userScriptRunFunction();

    __endOfCodeReached__ = true;
    __emitEndofCode();
});
