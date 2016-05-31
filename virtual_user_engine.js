//Virtual User Engine
'use strict';

var Advance_Require = require('advance-require');
var Http_Request_Options = require('http-request-hook');
var fs = require('fs');
var vm = require('vm');
var path = require('path');


var Virtual_User_Engine = function () {

    var thisObject = this;
    this.requireOptions = new Advance_Require.options();
    this.requestOptions = new Http_Request_Options.options();

    this.timeout = 900000;
    this.contextVariables = {};

    var _Code_FileName = null;
    var _Code_DirName = null;
    this.setCodeFileName = function (filename) {
        _Code_FileName = path.resolve(filename);
        _Code_DirName = path.dirname(filename);
    };


    var _code = "return null;";
    this.getCodeFromFile = function (filename) {

        var myRequireOptions = new Advance_Require.options();
        myRequireOptions.addOverrideModule(filename, function (moduleName, absolutefilename, originalRequire) {
            _code = fs.readFileSync(absolutefilename, 'utf8');
            _Code_FileName = absolutefilename;
            _Code_DirName = path.dirname(absolutefilename);
            return { };
        });
        myRequireOptions.addPath('./node_modules');
        var myInnerRequire = Advance_Require.getAdvanceRequire(module, myRequireOptions)
        myInnerRequire(filename);
    };
    this.getCodeFromString = function (codeString) {
        _code = codeString;
    };


    var wrapCode = function () {
        return '(function (exports, require, module, __filename, __dirname) { \n' + _code + '\n});';
    };



    var upgradedModule = null;
    var runFunction = null;
    this.prepareToRun = function () {

        var wrapedCode = wrapCode();
        upgradedModule = Advance_Require.getUpgradedModule(module, this.requireOptions);
        var myHttp = upgradedModule.prototype.require('http');
        var myHttps = upgradedModule.prototype.require('https');
        Http_Request_Options.applyRequestOptions(this.requestOptions, myHttp);
        Http_Request_Options.applyRequestOptions(this.requestOptions, myHttps);

        var context = createSafeContext();
        var contextOptions = {
            filename: __filename,
            timeout: this.timeout
        }
        runFunction = vm.runInContext(wrapedCode, context, contextOptions);
    } // prepare to run


    var createSafeContext = function () {

        var sandbox = {

            process: process,
            console: console,
            setTimeout: setTimeout,
            setInterval: setInterval,
            setImmediate: setImmediate,
            clearTimeout: clearTimeout,
            clearInterval: clearInterval,
            clearImmediate: clearImmediate
        };

        if (global.DTRACE_HTTP_SERVER_RESPONSE) {
            sandbox.DTRACE_HTTP_SERVER_RESPONSE = global.DTRACE_HTTP_SERVER_RESPONSE;
            sandbox.DTRACE_HTTP_SERVER_REQUEST = global.DTRACE_HTTP_SERVER_REQUEST;
            sandbox.DTRACE_HTTP_CLIENT_RESPONSE = global.DTRACE_HTTP_CLIENT_RESPONSE;
            sandbox.DTRACE_HTTP_CLIENT_REQUEST = global.DTRACE_HTTP_CLIENT_REQUEST;
            sandbox.DTRACE_NET_STREAM_END = global.DTRACE_NET_STREAM_END;
            sandbox.DTRACE_NET_SERVER_CONNECTION = global.DTRACE_NET_SERVER_CONNECTION;
            sandbox.DTRACE_NET_SOCKET_READ = global.DTRACE_NET_SOCKET_READ;
            sandbox.DTRACE_NET_SOCKET_WRITE = global.DTRACE_NET_SOCKET_WRITE;
        }
        if (global.COUNTER_NET_SERVER_CONNECTION) {
            sandbox.COUNTER_NET_SERVER_CONNECTION = global.COUNTER_NET_SERVER_CONNECTION;
            sandbox.COUNTER_NET_SERVER_CONNECTION_CLOSE = global.COUNTER_NET_SERVER_CONNECTION_CLOSE;
            sandbox.COUNTER_HTTP_SERVER_REQUEST = global.COUNTER_HTTP_SERVER_REQUEST;
            sandbox.COUNTER_HTTP_SERVER_RESPONSE = global.COUNTER_HTTP_SERVER_RESPONSE;
            sandbox.COUNTER_HTTP_CLIENT_REQUEST = global.COUNTER_HTTP_CLIENT_REQUEST;
            sandbox.COUNTER_HTTP_CLIENT_RESPONSE = global.COUNTER_HTTP_CLIENT_RESPONSE;
        }

        for (var item in thisObject.contextVariables) {  // Admin variables
            sandbox[item] = thisObject.contextVariables[item];
        }

        vm.createContext(sandbox);
        return sandbox;
    };



    this.run = function () {

        if (runFunction === null) {
            throw new Error('Code not ready to use, call "prepareToRun" first');
        }
        if (upgradedModule === null) {
            throw new Error('Problem initializing module, call "prepareToRun"');
        }

        if (_Code_DirName === null || _Code_FileName === null) {
            throw new Error('Filename of the running code not set, call "setCodeFileName"');
        }
        var temporaryExports = {};
        runFunction(temporaryExports, upgradedModule.prototype.require, upgradedModule, _Code_FileName, _Code_DirName);
    }

}





//---------------------------------------------------------------------------

module.exports = Virtual_User_Engine;
