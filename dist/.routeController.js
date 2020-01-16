"use strict";
exports.__esModule = true;
var express_1 = require("express");
var _helpers_1 = require("./.helpers");
var RouteController = /** @class */ (function () {
    function RouteController(Controller) {
        this.Controller = Controller;
        this.router = express_1.Router({ mergeParams: true });
    }
    RouteController.prototype.addRoute = function (path, httpMethod, controllerMethod) {
        var route = this.router.route(path);
        return route[httpMethod](_helpers_1.addMiddleware(this.Controller, controllerMethod, path));
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
