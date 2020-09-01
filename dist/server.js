"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
var fs = require("fs");
var path = require("path");
var express = require("express");
var fileupload = require("express-fileupload");
var cookieParser = require("cookie-parser");
var helmet = require("helmet");
var hpp = require("hpp");
var dotenv = require("dotenv");
var _cors_1 = require("./_cors");
// @ts-ignore
var xss = require("xss-clean");
if (fs.existsSync('./.env'))
    dotenv.config({ path: './.env' });
if (fs.existsSync('./config/config.env'))
    dotenv.config({ path: './config/config.env' });
var mode = process.env.NODE_ENV || 'development';
var RestfServer = /** @class */ (function () {
    function RestfServer(options) {
        if (options === void 0) { options = {}; }
        this._app = express();
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
            console.log('h3', req.url);
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
        this.use(express.static(path.join(__dirname, folder)));
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
        this.use(helmet());
        this.use(xss());
        this.use(hpp());
        this.use(_cors_1.default(this.options.allowHosts, this.options.allowHeaders));
    };
    RestfServer.prototype.setContentMiddlewares = function () {
        this.use(express.json());
        this.use(cookieParser());
        this.use(fileupload());
    };
    RestfServer.prototype.setControllersMiddleware = function () {
        this.use(function (req, _res, next) {
            console.log('h1');
            try {
                req.AllControllers = require('./.allControllers');
            }
            catch (e) {
                console.log('error to require .allControllers\n\n', e);
            }
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
            console.log(err);
            res.json({ error: error });
            return next();
        });
    };
    RestfServer.prototype.setUnhandledRejection = function () {
        process.on('unhandledRejection', function (err) {
            console.log('h2');
            process.stdout.write(("UnhandledRejection Error: " + err.message + "\n").red);
        });
    };
    return RestfServer;
}());
exports.default = RestfServer;
