//Virtual User Engine
'use strict';

var Advance_Require = require('advance-require');
var Http_Request_Hook = require('http-request-hook');
const _ = require('lodash');
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const util         = require("util");
const EventEmitter = require("events").EventEmitter;
const timers = require('timers');
const innerBuffer = require('buffer').Buffer;
const noop = function() {};

var Virtual_User_Engine = function () {

    EventEmitter.call(this);
    this.requireOptions = Advance_Require.options;
    Advance_Require.options.useSandbox = true;
    Advance_Require.options._useNativeModulesCopyList = ['http', 'https'];
    this.requestOptions = new Http_Request_Hook.options();

    this.timeout = 120000;
    this.contextVariables = {};
    this._Code_FileName = null;
    this._Code_DirName = null;
    this._code = "return null;";
}
util.inherits(Virtual_User_Engine, EventEmitter);
var VUE = new Virtual_User_Engine();

var emit = function () {
    VUE.emit.apply(VUE, arguments);
}

Virtual_User_Engine.prototype.getCodeFromFile = function (filename) {

    var absolutefilename = require.resolve(filename);
    this._code = fs.readFileSync(absolutefilename, 'utf8');

    this._Code_FileName = absolutefilename;
    this._Code_DirName = path.dirname(absolutefilename);
};

Virtual_User_Engine.prototype.getCodeFromString = function (codeString, filename) {
    this._code = codeString;
    if (!filename) filename = 'userscript.js';
    var absolutefilename = path.resolve(__dirname, filename);
    this._Code_FileName = absolutefilename;
    this._Code_DirName = path.dirname(absolutefilename);
};


function getContext(maxTimeout, userVariables, sandboxID) {

    function sandbox() {

        this.process = process;
        this.Buffer = innerBuffer;
        this._ActiveHandlers = 0;
        this.__sandboxID = sandboxID;
        this.__timeoutHappen = false;
        this.__endOfCodeReached__ = false;
        this.__scriptStartTime = 0;

        var self = this;
        var __timeoutHandle = 0;

        for (var item in userVariables) {  // Admin variables
            this[item] = userVariables[item];
        }

        this.decActiveHandlers = function (refname) {
            self._ActiveHandlers--;
            if (self.__endOfCodeReached__ && self._ActiveHandlers <= 0) {
                if (__timeoutHandle) clearTimeout(__timeoutHandle);
                var scriptEndTime = new Date();
                emit('vmEnd', self.__sandboxID, (scriptEndTime - self.__scriptStartTime) );
            }
        };
        this.incActiveHandlers = function (name) {
            self._ActiveHandlers++;
        };
        this.__emitOnStart = function() {
            self._ActiveHandlers = 0;
            self.__endOfCodeReached__ = false;
            self.__scriptStartTime = new Date();
            self.__timeoutHappen = false;

            __timeoutHandle = setTimeout(setTimeoutHappen, maxTimeout+50);

            emit('vmStart', self.__sandboxID);
        };
        var setTimeoutHappen = function () {
            self.__timeoutHappen = true;

            emit('vmTimeout', self.__sandboxID, self._ActiveHandlers);
            self.incActiveHandlers();
            self.decActiveHandlers('vmTimeout');
        };
        this.__emitEndofCode = function () {
            self.__endOfCodeReached__ = true;
            var scriptEndTime = new Date();
            if (self.__endOfCodeReached__ && self._ActiveHandlers <= 0) {
                if (__timeoutHandle) clearTimeout(__timeoutHandle);

                emit('vmEnd', self.__sandboxID, (scriptEndTime - self.__scriptStartTime) );
            } else {
                emit('vmEndofCode', self.__sandboxID, (scriptEndTime - self.__scriptStartTime) );
            }
        };

        this.clearImmediate = function (immediateObject) {
            if (immediateObject && immediate._onImmediate) {
                timers.clearImmediate(immediateObject);
                self.decActiveHandlers('clearImmediate');
            }
        };
        this.clearInterval = function (intervalObject) {
            if (intervalObject && intervalObject._repeat) {
                timers.clearInterval(intervalObject);
                self.decActiveHandlers('clearInterval');
            }
        };
        this.clearTimeout = function (timeoutObject) {
            if (timeoutObject && (timeoutObject[kOnTimeout] || timeoutObject._onTimeout)) {
                timers.clearTimeout(timeoutObject);
                self.decActiveHandlers('clearTimeout');
            }
        };
        this.setImmediate = function (callback, args) {
            if (self.__timeoutHappen) return {};

            self.incActiveHandlers('setImmediate');
            return timers.setImmediate(function () {
                callback.apply(args);
                self.decActiveHandlers('setImmediate_executed');
            });
        };
        this.setInterval = function (callback, delay, args) {
            if (self.__timeoutHappen) return {};

            self.incActiveHandlers('setInterval');
            var intervalObj = timers.setInterval(function () {
                if (self.__timeoutHappen) {
                    self.clearInterval(intervalObj);
                    return;
                }
                callback.apply(intervalObj, args);
            }, Math.min(delay, maxTimeout));
            return intervalObj;
        };
        this.setTimeout = function (callback, delay, args) {
            if (self.__timeoutHappen) return {};

            self.incActiveHandlers('setTimeout');
            return timers.setTimeout(function () {
                if (!self.__timeoutHappen) {
                    callback.apply(args);
                }
                self.decActiveHandlers('setTimeout_executed');
            }, Math.min(delay, maxTimeout));
        };

        if (global.DTRACE_HTTP_SERVER_RESPONSE) {
            this.DTRACE_HTTP_SERVER_RESPONSE = global.DTRACE_HTTP_SERVER_RESPONSE;
            this.DTRACE_HTTP_SERVER_REQUEST = global.DTRACE_HTTP_SERVER_REQUEST;
            this.DTRACE_HTTP_CLIENT_RESPONSE = global.DTRACE_HTTP_CLIENT_RESPONSE;
            this.DTRACE_HTTP_CLIENT_REQUEST = global.DTRACE_HTTP_CLIENT_REQUEST;
            this.DTRACE_NET_STREAM_END = global.DTRACE_NET_STREAM_END;
            this.DTRACE_NET_SERVER_CONNECTION = global.DTRACE_NET_SERVER_CONNECTION;
            this.DTRACE_NET_SOCKET_READ = global.DTRACE_NET_SOCKET_READ;
            this.DTRACE_NET_SOCKET_WRITE = global.DTRACE_NET_SOCKET_WRITE;
        }
        if (global.COUNTER_NET_SERVER_CONNECTION) {
            this.COUNTER_NET_SERVER_CONNECTION = global.COUNTER_NET_SERVER_CONNECTION;
            this.COUNTER_NET_SERVER_CONNECTION_CLOSE = global.COUNTER_NET_SERVER_CONNECTION_CLOSE;
            this.COUNTER_HTTP_SERVER_REQUEST = global.COUNTER_HTTP_SERVER_REQUEST;
            this.COUNTER_HTTP_SERVER_RESPONSE = global.COUNTER_HTTP_SERVER_RESPONSE;
            this.COUNTER_HTTP_CLIENT_REQUEST = global.COUNTER_HTTP_CLIENT_REQUEST;
            this.COUNTER_HTTP_CLIENT_RESPONSE = global.COUNTER_HTTP_CLIENT_RESPONSE;
        }
        this.console = {
            log: function () {
                var args = Array.prototype.slice.call(arguments);
                args.unshift('console.log', self.__sandboxID);
                emit.apply(null, args);
                return null;
            },
            info: function () {
                var args = Array.prototype.slice.call(arguments);
                args.unshift('console.info', self.__sandboxID);
                emit.apply(null, args);
                return null;
            },
            warn: function () {
                var args = Array.prototype.slice.call(arguments);
                args.unshift('console.warn', self.__sandboxID);
                emit.apply(null, args);
                return null;
            },
            error: function () {
                var args = Array.prototype.slice.call(arguments);
                args.unshift('console.error', self.__sandboxID);
                emit.apply(null, args);
                return null;
            },
            dir: function () {
                var args = Array.prototype.slice.call(arguments);
                args.unshift('console.dir', self.__sandboxID);
                emit.apply(null, args);
                return null;
            },
            time: noop,
            timeEnd: noop,
            trace: function () {
                var args = Array.prototype.slice.call(arguments);
                args.unshift('console.trace', self.__sandboxID);
                emit.apply(null, args);
                return null;
            }
        }; // console

    }; // end sandbox Constructor

    var mySandbox = new sandbox();
    if (Advance_Require.options._useNativeModulesCopyList.indexOf('http') < 0)
        Advance_Require.options._useNativeModulesCopyList.push('http');
    if (Advance_Require.options._useNativeModulesCopyList.indexOf('https') < 0)
        Advance_Require.options._useNativeModulesCopyList.push('https');

    var myRequire = Advance_Require.getAdvanceRequire(mySandbox);

  // Apply Active Handlre for async operations on modules
    // http and https request op
    var myRequestOptions = _.cloneDeep(VUE.requestOptions);

    myRequestOptions.requestQuery = function(options, callback) {
        if (mySandbox.__timeoutHappen) return false;
        else return(true);
    }

    myRequestOptions.on('request', function(req) {
        if (mySandbox.__timeoutHappen) {
            req.abort();
        } else {
            mySandbox.incActiveHandlers('request');
        }
    });

    myRequestOptions.on('response', function(req, res) {
        if (mySandbox.__timeoutHappen) {
            req.removeAllListeners();
            res.removeAllListeners();
            req.abort();
            res.destroy();
        }
    });

    myRequestOptions.on('afterResponse', function() {
        mySandbox.decActiveHandlers('afterResponse');
    });

    myRequestOptions.on('error', function(req, e) {
        mySandbox.decActiveHandlers('requestError');
    });


    Http_Request_Hook.applyRequestOptions(myRequestOptions, myRequire('http'));
    Http_Request_Hook.applyRequestOptions(myRequestOptions, myRequire('https'));
    // other async modules.....



  //Now just create the context
    vm.createContext(mySandbox);

    var contextOptions = {
        filename: VUE._Code_FileName
    }

    var wrapedCode = wrapCode(VUE._code);
    var runFunc= vm.runInContext(wrapedCode, mySandbox, contextOptions);

    return {sandbox: mySandbox, require: myRequire, runFunction: runFunc, ID: sandboxID};
}  // End getContext(maxTimeout, userVariables, sandboxID)


var wrapCode = function (code) {

    var wrapHeader = fs.readFileSync('./wraphead.jsw', 'utf8');
    var wrapFooter = fs.readFileSync('./wrapfoot.jsw', 'utf8');

    return wrapHeader + '\n' + code + '\n' + wrapFooter;
};


Virtual_User_Engine.prototype.getFullContext = function(sandboxID) {
    return getContext(this.timeout, this.contextVariables, sandboxID);
}

Virtual_User_Engine.prototype.run = function(fullContext) {

    var temporaryExports = {};
    fullContext.runFunction.call(module.exports, temporaryExports, fullContext.require, module, this._Code_FileName, this._Code_DirName);
}


module.exports = VUE;