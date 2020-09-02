"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
var xss_clean_1 = __importDefault(require("xss-clean"));
var express_1 = __importDefault(require("express"));
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var helmet_1 = __importDefault(require("helmet"));
var hpp_1 = __importDefault(require("hpp"));
var _cors_1 = __importDefault(require("./_cors"));
if (fs_1.default.existsSync('./.env'))
    dotenv_1.default.config({ path: './.env' });
if (fs_1.default.existsSync('./config/config.env'))
    dotenv_1.default.config({ path: './config/config.env' });
var mode = process.env.NODE_ENV || 'development';
var RestfServer = /** @class */ (function () {
    function RestfServer(options) {
        if (options === void 0) { options = {}; }
        this._app = express_1.default();
        this.options = options;
        this.setContentMiddlewares();
        this.setControllersMiddleware();
        this.setSecurityMiddlewares();
        this.setAfterMiddlewares();
    }
    RestfServer.prototype.use = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._app.use(function (req, _res, next) {
            next();
        });
        return (_a = this._app).use.apply(_a, args);
    };
    RestfServer.prototype.apidocs = function (folder, route) {
        if (folder === void 0) { folder = 'doc'; }
        if (!route)
            route = folder;
        this._app.get("/" + route, function (_, res) { return res.sendFile(process.cwd() + "/" + folder + "/index.html"); });
    };
    RestfServer.prototype.public = function (folder) {
        if (folder === void 0) { folder = 'public'; }
        this.use(express_1.default.static(path_1.default.join(__dirname, folder)));
    };
    RestfServer.prototype.listen = function (port) {
        if (port === void 0) { port = 5000; }
        this.setEndpointNotFoundMiddleware();
        this.setGeneralErrorMiddleware();
        this.setUnhandledRejection();
        var DEFAULT_PORT = process.env.PORT || port.toString();
        var message = ("Server running in " + mode + " mode on port " + DEFAULT_PORT + "\n").cyan;
        this._app.listen(DEFAULT_PORT, function () { return process.stdout.write(message); });
    };
    RestfServer.prototype.useAfter = function (middleware) {
        this.afterMiddlewares.push(middleware);
    };
    RestfServer.prototype.setAfterMiddlewares = function () {
        var _this = this;
        this.afterMiddlewares = [];
        this.use(function (req, res, next) {
            req.afterMiddlewares = _this.afterMiddlewares;
            return next();
        });
    };
    RestfServer.prototype.setSecurityMiddlewares = function () {
        this.use(helmet_1.default());
        this.use(xss_clean_1.default());
        this.use(hpp_1.default());
        this.use(_cors_1.default(this.options.allowHosts, this.options.allowHeaders));
    };
    RestfServer.prototype.setContentMiddlewares = function () {
        this.use(express_1.default.json());
        this.use(cookie_parser_1.default());
        this.use(express_fileupload_1.default());
    };
    RestfServer.prototype.setControllersMiddleware = function () {
        this.use(function (req, _res, next) {
            req.AllControllers = require('./.allControllers');
            next();
        });
    };
    RestfServer.prototype.setEndpointNotFoundMiddleware = function () {
        this.use(function (_, res) {
            var error = 'Endpoint not found';
            res.status(404);
            return res.json({ error: error });
        });
    };
    RestfServer.prototype.setGeneralErrorMiddleware = function () {
        this.use(function (err, req, res, next) {
            var error = err.message || 'Server Error';
            res.status(err.statusCode || 500);
            res.json({ error: error });
            console.log(error);
            return next();
        });
    };
    RestfServer.prototype.setUnhandledRejection = function () {
        process.on('unhandledRejection', function (err) {
            process.stdout.write(("UnhandledRejection Error: " + err.message + "\n").red);
        });
    };
    return RestfServer;
}());
exports.default = RestfServer;
