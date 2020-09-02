"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMiddleware = void 0;
function addMiddleware(controllerName, controllerMethod, path) {
    return (req, res) => {
        try {
            fixEndingParams(req.params);
            const controllerInstance = new req.AllControllers[controllerName]();
            controllerInstance.req = req;
            controllerInstance.res = res;
            const result = controllerInstance.run(controllerMethod, ...middlewareParams(path, req));
            if (controllerInstance.sent)
                return result;
            if (!isPromise(result))
                return controllerInstance.respondWith(result);
            return result.then((r) => controllerInstance.respondWith(r)).catch(handleError(controllerInstance));
        }
        catch (e) {
            res.status(500);
            res.send('');
        }
    };
}
exports.addMiddleware = addMiddleware;
function fixEndingParams(params) {
    if (!params[0])
        return undefined;
    const endingParam = params[0];
    delete params[0];
    const lastKey = Object.keys(params).pop();
    params[lastKey] += endingParam;
}
function handleError(controllerInstance) {
    return (error) => {
        let statusCode = 500;
        if (error.message === 'Not Found')
            statusCode = 404;
        return controllerInstance.respondWith({ message: error.message, statusCode });
    };
}
function isPromise(obj) {
    if (!obj)
        return false;
    return obj.then !== undefined;
}
function middlewareParams(path, req) {
    if (!/:/.test(path))
        return [];
    if (path === '/:id')
        return [req.params.id];
    if (/:\w+\*/.test(path))
        return endingParam(path, req);
    return Object.values(req.params);
}
function endingParam(path, req) {
    const params = req.params;
    const sufix = params['0'] || '';
    delete params['0'];
    const lastParamName = Object.keys(params).pop();
    const lastParam = params[lastParamName] || '';
    params[lastParamName] = lastParam + sufix;
    return Object.values(params);
}
