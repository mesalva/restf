"use strict";
exports.__esModule = true;
var express_1 = require("express");
var routeDocsRender_1 = require("./routeDocsRender");
var routeController_1 = require("./routeController");
var Router = /** @class */ (function () {
    function Router() {
        this.router = express_1.Router();
        this.routes = [];
    }
    Router.prototype.resources = function (path, Controller) {
        var router = new routeController_1["default"](Controller);
        var routeReport = { path: path, type: 'resources', subRoutes: [] };
        var methods = routeController_1["default"].resourcesMethods(Controller);
        var addRoute = function (path, type, method) {
            if (!methods[type])
                return null;
            routeReport.subRoutes && routeReport.subRoutes.push({ path: path, type: type, method: method });
            return router[method](path, type);
        };
        addRoute("/", "index", "get");
        addRoute("/", "create", "post");
        addRoute("/:id", "show", "get");
        addRoute("/:id", "update", "put");
        addRoute("/:id", "destroy", "delete");
        this.routes.push(routeReport);
        this.router.use(path, router.listen());
        return this;
    };
    Router.prototype.docs = function (path) {
        var _this = this;
        this.router.get(path, function (req, res) { return new routeDocsRender_1["default"](req, res).render(_this.routes); });
    };
    Router.prototype.post = function (path, method, Controller) {
        this.routes.push({ path: path, method: 'post', type: method });
        this.router.post(path, routeController_1.addMiddleware(Controller, method, path));
        return this;
    };
    Router.prototype.get = function (path, method, Controller) {
        this.routes.push({ path: path, method: 'get', type: method });
        this.router.get(path, routeController_1.addMiddleware(Controller, method, path));
        return this;
    };
    Router.prototype.listen = function () {
        return this.router;
    };
    return Router;
}());
exports["default"] = Router;
