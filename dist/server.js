"use strict";
exports.__esModule = true;
require("colors");
var fs = require("fs");
var path = require("path");
var express = require("express");
var fileupload = require("express-fileupload");
var cookieParser = require("cookie-parser");
var helmet = require("helmet");
var rateLimit = require("express-rate-limit");
var hpp = require("hpp");
var dotenv = require("dotenv");
var _cors_1 = require("./.cors");
// @ts-ignore
var xss = require("xss-clean");
if (fs.existsSync('./config/.env'))
    dotenv.config({ path: './config/.env' });
if (fs.existsSync('./config/config.env'))
    dotenv.config({ path: './config/config.env' });
var PORT = process.env.PORT || '5000';
var mode = process.env.NODE_ENV || 'development';
// Rate limiting
var tenMinutes = 10 * 60 * 1000;
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
    RestfServer.prototype.listen = function () {
        this.setEndpointNotFoundMiddleware();
        this.setGeneralErrorMiddleware();
        this.setUnhandledRejection();
        var message = ("Server running in " + mode + " mode on port " + PORT + "\n").cyan;
        this._app.listen(PORT, function () { return process.stdout.write(message); });
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
        this.use(rateLimit({ windowMs: tenMinutes, max: 100 }));
        this.use(_cors_1["default"](this.options.hosts));
    };
    RestfServer.prototype.setContentMiddlewares = function () {
        this.use(express.json());
        this.use(cookieParser());
        this.use(fileupload());
    };
    RestfServer.prototype.setControllersMiddleware = function () {
        this.use(function (req, _res, next) {
            req.AllControllers = require("./.allControllers.js");
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
exports["default"] = RestfServer;
