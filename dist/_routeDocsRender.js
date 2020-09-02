"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _routeDocsRender = /** @class */ (function () {
    function _routeDocsRender(req, res) {
        var _this = this;
        this.renderRow = function (route) {
            if (route.type === 'resources') {
                var content_1 = "<div style=\"margin-top: 24px;\">Resources: " + route.path + "</div>";
                route.subRoutes.forEach(function (r) {
                    content_1 += "<div style=\"margin-left: 24px;\">" + r.method + " - " + (r.type || '') + "(" + route.path + r.path + ")</div>";
                });
                _this.lastBase = route.path.split('/')[1];
                return content_1;
            }
            _this.lastBase = route.path.split('/')[1];
            return "<div style=\"margin-top: 24px;\">" + route.method + " - " + (route.type || '') + "(" + route.path + ")</div>";
        };
        this.req = req;
        this.res = res;
    }
    _routeDocsRender.prototype.render = function (routes) {
        var values = routes.map(this.renderRow).join('');
        return this.res.send(values);
    };
    return _routeDocsRender;
}());
exports.default = _routeDocsRender;
