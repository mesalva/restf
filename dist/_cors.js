"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function _cors(hostsStr, allowHeaders) {
    return function (req, res, next) {
        var hosts = parseHosts(hostsStr);
        var origin = getOrigin(req.headers);
        if (hosts.length === 0 || !origin) {
            setCors(res, '*');
            return next();
        }
        var domain = origin.replace(/http(s)?:\/\//, '');
        if (!hosts.includes(domain)) {
            res.status(403);
            return res.send();
        }
        setCors(res, origin, allowHeaders);
        if (req.method !== 'OPTIONS')
            return next();
        return res.send();
    };
}
exports.default = _cors;
function parseHosts(hosts) {
    if (Array.isArray(hosts))
        return hosts;
    if (typeof hosts === 'string')
        return hosts.replace(/\s/g, '').split(',');
    return [];
}
function getOrigin(headers) {
    return headers.origin || '';
}
function setCors(res, origin, allowHeaders) {
    if (allowHeaders === void 0) { allowHeaders = '*'; }
    res.setHeader('Access-Control-Allow-Headers', allowHeaders);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,OPTIONS,HEADERS');
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}
