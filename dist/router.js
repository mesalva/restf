"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var _routeDocsRender_1 = require("./.routeDocsRender");
var _routeController_1 = require("./.routeController");
var _helpers_1 = require("./.helpers");
var RestfRouter = /** @class */ (function () {
    function RestfRouter() {
        this.router = express_1.Router();
        this.routes = [];
        this.get = this.addMethod('get');
        this.post = this.addMethod('post');
        this.delete = this.addMethod('delete');
        this.update = this.addMethod('update');
    }
    RestfRouter.prototype.resources = function (endpoint, Controller) {
        var router = new _routeController_1.default(Controller);
        var routeReport = { path: endpoint, type: 'resources', subRoutes: [] };
        var methods = _routeController_1.default.resourcesMethods(Controller);
        var addRoute = function (path, type, method) {
            if (!methods[type])
                return null;
            routeReport.subRoutes && routeReport.subRoutes.push({ path: path, type: type, method: method });
            return router[method](path, type);
        };
        addRoute('/', 'index', 'get');
        addRoute('/', 'create', 'post');
        addRoute('/:id', 'show', 'get');
        addRoute('/:id', 'update', 'put');
        addRoute('/:id', 'destroy', 'delete');
        this.routes.push(routeReport);
        this.router.use(endpoint, router.listen());
        return this;
    };
    RestfRouter.prototype.docs = function (path) {
        var _this = this;
        this.router.get(path, function (req, res) { return new _routeDocsRender_1.default(req, res).render(_this.routes); });
    };
    RestfRouter.prototype.listen = function () {
        return this.router;
    };
    RestfRouter.prototype.addMethod = function (httpMethod) {
        var _this = this;
        return function (path, controllerMethod) {
            var _a = controllerMethod.split(/[@.]/), controllerName = _a[0], methodName = _a[1];
            _this.routes.push({ path: path, method: httpMethod, type: methodName });
            _this.router[httpMethod](path, _helpers_1.addMiddleware(controllerName, methodName, path));
            return _this;
        };
    };
    return RestfRouter;
}());
exports.default = RestfRouter;
