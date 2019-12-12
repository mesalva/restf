"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var express_1 = require("express");
var RouteController = /** @class */ (function () {
    function RouteController(Controller) {
        this.Controller = Controller;
        this.router = express_1.Router({ mergeParams: true });
    }
    RouteController.prototype.addRoute = function (path, httpMethod, controllerMethod) {
        var route = this.router.route(path);
        return route[httpMethod](addMiddleware(this.Controller, controllerMethod, path));
    };
    RouteController.prototype.get = function (path, controllerMethod) {
        return this.addRoute(path, 'get', controllerMethod);
    };
    RouteController.prototype.post = function (path, controllerMethod) {
        return this.addRoute(path, 'post', controllerMethod);
    };
    RouteController.prototype.put = function (path, controllerMethod) {
        return this.addRoute(path, 'put', controllerMethod);
    };
    RouteController.prototype["delete"] = function (path, controllerMethod) {
        return this.addRoute(path, 'delete', controllerMethod);
    };
    RouteController.prototype.listen = function () {
        return this.router;
    };
    RouteController.resourcesMethods = function (Controller) {
        var allowedMethods = ['index', 'create', 'show', 'update', 'destroy'];
        return Object.getOwnPropertyNames(Controller.prototype).reduce(function (obj, name) {
            obj[name] = allowedMethods.includes(name);
            return obj;
        }, {});
    };
    return RouteController;
}());
exports["default"] = RouteController;
function addMiddleware(Controller, controllerMethod, path) {
    return function (req, res) {
        var controllerInstance = new Controller(req, res);
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
