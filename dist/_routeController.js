"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _helpers_1 = require("./_helpers");
class _routeController {
    constructor(Controller) {
        this.Controller = Controller;
        this.router = express_1.Router({ mergeParams: true });
    }
    addRoute(path, httpMethod, controllerMethod) {
        const route = this.router.route(path);
        return route[httpMethod](_helpers_1.addMiddleware(this.Controller, controllerMethod, path));
    }
    get(path, controllerMethod) {
        return this.addRoute(path, 'get', controllerMethod);
    }
    post(path, controllerMethod) {
        return this.addRoute(path, 'post', controllerMethod);
    }
    put(path, controllerMethod) {
        return this.addRoute(path, 'put', controllerMethod);
    }
    delete(path, controllerMethod) {
        return this.addRoute(path, 'delete', controllerMethod);
    }
    listen() {
        return this.router;
    }
    static resourcesMethods(Controller) {
        const allowedMethods = ['index', 'create', 'show', 'update', 'destroy'];
        return Object.getOwnPropertyNames(Controller.prototype).reduce((obj, name) => {
            obj[name] = allowedMethods.includes(name);
            return obj;
        }, {});
    }
}
exports.default = _routeController;
