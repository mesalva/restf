"use strict";
exports.__esModule = true;
var express_1 = require("express");
var _routeDocsRender_1 = require("./.routeDocsRender");
var _routeController_1 = require("./.routeController");
var RestfRouter = /** @class */ (function () {
    function RestfRouter() {
        this.router = express_1.Router();
        this.routes = [];
        this.get = this._addMethod('get');
        this.post = this._addMethod('post');
        this["delete"] = this._addMethod('delete');
        this.update = this._addMethod('update');
    }
    RestfRouter.prototype.resources = function (endpoint, Controller) {
        var router = new _routeController_1["default"](Controller);
        var routeReport = { path: endpoint, type: 'resources', subRoutes: [] };
        var methods = _routeController_1["default"].resourcesMethods(Controller);
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
        this.router.use(endpoint, router.listen());
        return this;
    };
    RestfRouter.prototype.docs = function (path) {
        var _this = this;
        this.router.get(path, function (req, res) { return new _routeDocsRender_1["default"](req, res).render(_this.routes); });
    };
    RestfRouter.prototype.listen = function () {
        return this.router;
    };
    RestfRouter.prototype._addMethod = function (httpMethod) {
        var _this = this;
        return function (path, Controller, controllerMethod) {
            _this.routes.push({ path: path, method: httpMethod, type: controllerMethod });
            _this.router[httpMethod](path, _routeController_1.addMiddleware(Controller, controllerMethod, path));
            return _this;
        };
    };
    return RestfRouter;
}());
exports["default"] = RestfRouter;
