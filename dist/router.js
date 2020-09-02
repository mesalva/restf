"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _routeDocsRender_1 = __importDefault(require("./_routeDocsRender"));
const _routeController_1 = __importDefault(require("./_routeController"));
const _helpers_1 = require("./_helpers");
class RestfRouter {
    constructor() {
        this.router = express_1.Router();
        this.routes = [];
        this.get = this.addMethod('get');
        this.post = this.addMethod('post');
        this.delete = this.addMethod('delete');
        this.update = this.addMethod('update');
    }
    resources(endpoint, Controller) {
        const router = new _routeController_1.default(Controller);
        const routeReport = { path: endpoint, type: 'resources', subRoutes: [], controller: Controller };
        const methods = _routeController_1.default.resourcesMethods(Controller);
        const addRoute = (path, type, method) => {
            if (!methods[type])
                return null;
            routeReport.subRoutes && routeReport.subRoutes.push({ path, type, method });
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
    }
    docs(path) {
        this.router.get(path, (req, res) => new _routeDocsRender_1.default(req, res).render(this.routes));
    }
    listen() {
        this.router['routes'] = this.routes.map(route => `router.${route.method}('${route.path}', '${route.controller}.${route.type}')`);
        return this.router;
    }
    addMethod(httpMethod) {
        return (path, controllerMethod) => {
            const [controllerName, methodName] = controllerMethod.split(/[@.]/);
            this.routes.push({ path, method: httpMethod, type: methodName, controller: controllerName });
            this.router[httpMethod](path, _helpers_1.addMiddleware(controllerName, methodName, path));
            return this;
        };
    }
}
exports.default = RestfRouter;
