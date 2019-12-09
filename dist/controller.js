"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var RestfController = /** @class */ (function () {
    function RestfController(req, res) {
        this.req = req;
        this.res = res;
    }
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
    return RestfController;
}());
exports["default"] = RestfController;
function objectFilter(obj, fields) {
    return fields.reduce(function (result, field) {
        if (obj[field])
            result[field] = obj[field];
        return result;
    }, {});
}
