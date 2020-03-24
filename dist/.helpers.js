"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
function addMiddleware(controllerName, controllerMethod, path) {
    return function (req, res) {
        var controllerInstance = new req.AllControllers[controllerName](req, res);
        var result = controllerInstance.run.apply(controllerInstance, __spreadArrays([controllerMethod], middlewareParams(path, req)));
        if (controllerInstance.sent)
            return result;
        if (!isPromise(result))
            return controllerInstance.respondWith(result);
        return result.then(function (r) { return controllerInstance.respondWith(r); })["catch"](handleError(controllerInstance));
    };
}
exports.addMiddleware = addMiddleware;
function handleError(controllerInstance) {
    return function (error) {
        var status = 500;
        if (error.message === 'Not Found')
            status = 404;
        return controllerInstance.respondWith({ message: error.message, status: status });
    };
}
function isPromise(obj) {
    if (!obj)
        return false;
    return obj.then !== undefined;
}
function middlewareParams(path, req) {
    if (!/:/.test(path))
        return [];
    if (path === '/:id')
        return [req.params.id];
    if (/:\w+\*/.test(path))
        return endingParam(path, req);
    return Object.values(req.params);
}
function endingParam(path, req) {
    var params = req.params;
    var sufix = params['0'];
    delete params['0'];
    var lastParamName = path.replace(/.*\/:(\w+)\*$/, '$1');
    params[lastParamName] = params[lastParamName] + sufix;
    return Object.values(params);
}