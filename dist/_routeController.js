"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var _helpers_1 = require("./_helpers");
var _routeController = /** @class */ (function () {
    function _routeController(Controller) {
        this.Controller = Controller;
        this.router = express_1.Router({ mergeParams: true });
    }
    _routeController.prototype.addRoute = function (path, httpMethod, controllerMethod) {
        var route = this.router.route(path);
        return route[httpMethod](_helpers_1.addMiddleware(this.Controller, controllerMethod, path));
    };
    _routeController.prototype.get = function (path, controllerMethod) {
        return this.addRoute(path, 'get', controllerMethod);
    };
    _routeController.prototype.post = function (path, controllerMethod) {
        return this.addRoute(path, 'post', controllerMethod);
    };
    _routeController.prototype.put = function (path, controllerMethod) {
        return this.addRoute(path, 'put', controllerMethod);
    };
    _routeController.prototype.delete = function (path, controllerMethod) {
        return this.addRoute(path, 'delete', controllerMethod);
    };
    _routeController.prototype.listen = function () {
        return this.router;
    };
    _routeController.resourcesMethods = function (Controller) {
        var allowedMethods = ['index', 'create', 'show', 'update', 'destroy'];
        return Object.getOwnPropertyNames(Controller.prototype).reduce(function (obj, name) {
            obj[name] = allowedMethods.includes(name);
            return obj;
        }, {});
    };
    return _routeController;
}());
exports.default = _routeController;
