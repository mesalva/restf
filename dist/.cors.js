"use strict";
exports.__esModule = true;
function cors() {
    return function (req, res, next) {
        var knownHosts = process.env.KNOWN_HOSTS || '';
        var hosts = knownHosts.replace(/\s/g, '').split(',');
        var origin = getOrigin(req.headers);
        if (!origin) {
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
function getOrigin(headers) {
    return headers.origin || '';
}
function setCors(res, origin) {
    res.setHeader('Access-Control-Allow-Headers', 'access-control-allow-headers,cache,content-type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT');
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}
