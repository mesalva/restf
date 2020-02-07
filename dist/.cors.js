"use strict";
exports.__esModule = true;
function cors(hostsStr) {
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
        setCors(res, origin);
        if (req.method !== 'OPTIONS')
            return next();
        return res.send();
    };
}
exports["default"] = cors;
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
function setCors(res, origin) {
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT');
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}
