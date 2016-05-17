'use strict';


module.exports = function (sandboxOptions) { // returns a sandbox object


    this.global = global;
    this.require = function(moduleName) {

        if (sandboxOptions.filteredModuleList.indexOf(moduleName) >= 0) {
            throw new Error('unauthorized module call ', moduleName);
            return { };
        }

        if (sandboxOptions.AVAILABLE_NATIVE_MODULES.indexOf(moduleName) >= 0) {

            if (moduleName === 'http' || moduleName === 'https') {

                let httpObject = require(moduleName);
                modifyRequest(httpObject);
                return httpObject;

            } else {

                return require(moduleName);
            }
        }

        if (sandboxOptions.allowedOutsideModuleList.indexOf(moduleName) >= 0) {

            return require(moduleName);
        }
    }


    // ------  this will modify the HTTP.request
    // ------  to add the middlewares, so we can record data for analysis

    var modifyRequest = function(HTTPobject) {
        var original = HTTPobject.request;

        HTTPobject.request = function(options, callback) {

            // Before Request middleware Calls for controls
            for (var i = 0; i < sandboxOptions.beforeRequestMiddlewareList.length; i++) {
                let middlewareFunction = sandboxOptions.beforeRequestMiddlewareList[i];
                if (! middlewareFunction.call(options)) {

                    throw new Error('request call denied by Admin controls');
                    return { };
                }
            }

            // on response, call the functions and
            var newCallback = function() {
                var res = arguments[0];

                for (var i = 0; i < sandboxOptions.responseMiddlewareList.length; i++) {
                    let middlewareFunction = sandboxOptions.responseMiddlewareList[i];
                    setTimeout(middlewareFunction, 0, requestObj, arguments[0]);
                }
                callback.apply(this,arguments);
            }


            var requestObj = original(options, newCallback);

            // after Request sent, call request middlewares
            for (var i = 0; i < sandboxOptions.requestMiddlewareList.length; i++) {
                let middlewareFunction = sandboxOptions.requestMiddlewareList[i];
                middlewareFunction.call(requestObj, options);
            }


            request.setTimeout(requestTimeout, function() {

                // the request timeout middleware Calls
                for (var i = 0; i < sandboxOptions.requestTimeoutMiddlewareList.length; i++) {
                    let middlewareFunction = sandboxOptions.requestTimeoutMiddlewareList[i];
                    middlewareFunction.call(requestObj);
                }
            });

            return requestObj;
        }
    }
}
