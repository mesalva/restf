"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var Controller = /** @class */ (function () {
    function Controller(req, res) {
        this.req = req;
        this.res = res;
    }
    Controller.prototype.status = function (code) {
        this.res.status(code);
        return this;
    };
    Controller.prototype.respondWith = function (data, options) {
        if (options === void 0) { options = {}; }
        if (this.sent)
            return null;
        if (options.status)
            this.res.status(options.status);
        this.sent = true;
        if (options.status || data)
            return this.res.json(data);
        this.res.status(204);
        return this.res.send();
    };
    Controller.prototype.params = function () {
        var permit = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            permit[_i] = arguments[_i];
        }
        var controllerPermit = this.permit;
        if (controllerPermit)
            permit = __spreadArrays(controllerPermit, permit);
        return objectFilter(this.req.body, permit);
    };
    return Controller;
}());
exports["default"] = Controller;
function objectFilter(obj, fields) {
    return fields.reduce(function (result, field) {
        if (obj[field])
            result[field] = obj[field];
        return result;
    }, {});
}
