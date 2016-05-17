'use strict';

// sandboxSettings object

module.exports = function (userOptions) {  // constructor method

    let options = {
        beforeRequestMiddlewareList: [],
        requestMiddlewareList: [],
        responseMiddlewareList: [],
        filteredDefaultModuleList: [],
        allowedOutsideModuleList: [],
        timeout: 180000, // default 2 minutes
        requestTimeout: 120000,
        AVAILABLE_NATIVE_MODULES: ['assert', 'buffer', 'child_process', 'constants', 'crypto', 'tls', 'dgram', 'dns', 'http', 'https', 'net', 'querystring', 'url', 'domain', 'events', 'fs', 'path', 'module', 'os', 'punycode', 'stream', 'string_decoder', 'timers', 'tty', 'util', 'sys', 'vm', 'zlib']
    }


    this.getOptions = function() {
        let optionsCopy = JSON.parse(JSON.stringify(options));;
        return(optionsCopy);
    }


    this.AddBeforeRequestMiddleware = function (middleware) {

        if (!middleware) return;
        if (typeof middleware === "function") {
            if (options.beforeRequestMiddlewareList.indexOf(middleware) >= 0) return;
            options.beforeRequestMiddlewareList.push(middleware);
        }
    }


    this.removeBeforeRequestMiddleware = function (middleware) {
        if (!middleware) return;
        if (typeof middleware === "function") {
            var placeInArray = options.beforeRequestMiddlewareList.indexOf(middleware);
            if (placeInArray >= 0) options.beforeRequestMiddlewareList.splice(placeInArray, 1);
        }
    }


    this.AddRequestMiddleware = function (middleware) {

        if (!middleware) return;
        if (typeof middleware === "function") {
            if (options.requestMiddlewareList.indexOf(middleware) >= 0) return;
            options.requestMiddlewareList.push(middleware);
        }
    }


    this.removeRequestMiddleware = function (middleware) {
        if (!middleware) return;
        if (typeof middleware === "function") {
            var placeInArray = options.requestMiddlewareList.indexOf(middleware);
            if (placeInArray >= 0) options.requestMiddlewareList.splice(placeInArray, 1);
        }
    }


    this.AddResponseMiddleware = function (middleware) {

        if (!middleware) return;
        if (typeof middleware === "function") {
            if (options.responseMiddlewareList.indexOf(middleware) >= 0) return;
            options.responseMiddlewareList.push(middleware);
        }
    }


    this.removeResponseMiddleware = function (middleware) {
        if (!middleware) return;
        if (typeof middleware === "function") {
            var placeInArray = options.responseMiddlewareList.indexOf(middleware);
            if (placeInArray >= 0) options.responseMiddlewareList.splice(placeInArray, 1);
        }
    }


    this.setFilteredModuleList = function (filterList) {
        if (typeof filterList === 'object' && Array.isArray(filterList))
            options.filteredDefaultModuleList = filterList.slice(0);
    }


    this.setAllowedModuleList = function (allowedList) {
        if (typeof allowedList === 'object' && Array.isArray(allowedList))
            options.allowedOutsideModuleList = allowedList.slice(0);
    }


    this.addFilteredModule = function (moduleName) {
        if (typeof moduleName === 'string' || moduleName instanceof String) {
            var placeInArray = options.filteredDefaultModuleList.indexOf(moduleName);
            if (placeInArray >= 0) options.filteredDefaultModuleList.push(moduleName);
        }
    }

    this.removeFilteredModule = function (moduleName) {
        if (typeof moduleName === 'string' || moduleName instanceof String) {
            var placeInArray = options.filteredDefaultModuleList.indexOf(moduleName);
            if (placeInArray >= 0) options.filteredDefaultModuleList.splice(placeInArray, 1);
        }
    }

    this.addAllowedModule = function (moduleName) {
        if (typeof moduleName === 'string' || moduleName instanceof String) {
            var placeInArray = options.allowedOutsideModuleList.indexOf(moduleName);
            if (placeInArray >= 0) options.allowedOutsideModuleList.push(moduleName);
        }
    }


    this.removeAllowedModule = function (moduleName) {
        if (typeof moduleName === 'string' || moduleName instanceof String) {
            var placeInArray = options.allowedOutsideModuleList.indexOf(moduleName);
            if (placeInArray >= 0) options.allowedOutsideModuleList.splice(placeInArray, 1);
        }
    }

    this.setTimeout = function (timeoutMilliseconds) {
        if (Number.isInteger(timeoutMilliseconds)) options.timeout = timeoutMilliseconds;
    }


    this.setRequestTimeout = function (timeoutMilliseconds) {
        if (Number.isInteger(timeoutMilliseconds)) options.requestTimeout = timeoutMilliseconds;
    }


    if (userOptions) {

        if (userOptions.beforeRequestMiddlewareList) {
            if (Array.isArray(userOptions.beforeRequestMiddlewareList)) {
                for (let i = 0; i < userOptions.beforeRequestMiddlewareList.length; i++)
                    this.AddBeforeRequestMiddleware(userOptions.beforeRequestMiddlewareList[i]);
            }
        }

        if (userOptions.requestMiddlewareList) {
            if (Array.isArray(userOptions.requestMiddlewareList)) {
                for (let i = 0; i < userOptions.requestMiddlewareList.length; i++)
                    this.AddRequestMiddleware(userOptions.requestMiddlewareList[i]);
            }
        }

        if (userOptions.responseMiddlewareList) {
            if (Array.isArray(userOptions.responseMiddlewareList)) {
                for (let i = 0; i < userOptions.responseMiddlewareList.length; i++)
                    this.AddResponseMiddleware(userOptions.responseMiddlewareList[i]);
            }
        }

        if (userOptions.filteredModuleList) this.setFilteredModuleList(options.filteredModuleList);
        if (userOptions.allowedModuleList) this.setAllowedModuleList(options.allowedModuleList);
        if (userOptions.timeout) this.setTimeout(options.timeout);
        if (userOptions.requestTimeout) this.setRequestTimeout(options.requestTimeout);
    }

}  // end of module constructor function

//---------------------------------------------------------------------------------------------------------------------

