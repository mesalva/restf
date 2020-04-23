"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = require("jsonwebtoken");
var RestfController = /** @class */ (function () {
    function RestfController(req, res) {
        this.currentMethod = 'undefined';
        this.req = req;
        this.res = res;
    }
    RestfController.prototype.run = function (method) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.currentMethod = method;
        return this[method].apply(this, args);
    };
    RestfController.prototype.status = function (code) {
        this.res.status(code);
        return this;
    };
    RestfController.prototype.respondWith = function (data, options) {
        if (options === void 0) { options = {}; }
        if (this.sent)
            return null;
        if (options.status)
            this.res.status(options.status);
        if (options.status || data)
            return this.sendWithMiddlewares(data);
        this.sent = true;
        this.res.status(204);
        return this.res.send();
    };
    Object.defineProperty(RestfController.prototype, "currentUser", {
        get: function () {
            if (this.req.credentials)
                return this.req.credentials;
            var authorization = this.req.cookies.token || this.req.headers.authorization;
            if (!authorization)
                return null;
            var token = authorization.replace(/bearer( +)?/i, '');
            if (!token)
                return null;
            this.req.credentials = this.tokenToCredentials(token);
            Object.defineProperty(this.req.credentials, 'iat', { enumerable: false });
            Object.defineProperty(this.req.credentials, 'exp', { enumerable: false });
            return this.req.credentials;
        },
        enumerable: true,
        configurable: true
    });
    RestfController.prototype.tokenToCredentials = function (token) {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
    };
    RestfController.prototype.serialize = function () {
        var _a;
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        var constructor = this.constructor;
        var Serializer = constructor.serializer;
        if (!Serializer)
            return null;
        var currentMethod = this.currentMethod;
        return (_a = new Serializer(this))[currentMethod].apply(_a, a);
    };
    RestfController.prototype.sendWithMiddlewares = function (data, i) {
        var _this = this;
        if (i === void 0) { i = 0; }
        if (this.req.afterMiddlewares && i < this.req.afterMiddlewares.length) {
            return this.req.afterMiddlewares[i](this, data, function (newData) { return _this.sendWithMiddlewares(newData, i + 1); });
        }
        if (this.sent)
            return null;
        this.sent = true;
        if (typeof data === 'string')
            return this.res.send(data);
        return this.res.json(data);
    };
    RestfController.prototype.params = function () {
        var permit = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            permit[_i] = arguments[_i];
        }
        var controllerPermit = this.permit;
        if (controllerPermit)
            permit = __spreadArrays(controllerPermit, permit);
        if (permit.length === 0)
            return this.req.body;
        return objectFilter(this.req.body, permit);
    };
    RestfController.serialize = undefined;
    return RestfController;
}());
exports.default = RestfController;
function objectFilter(obj, fields) {
    return fields.reduce(function (result, field) {
        if (obj[field])
            result[field] = obj[field];
        return result;
    }, {});
}
