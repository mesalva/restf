"use strict";
exports.__esModule = true;
require("colors");
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
dotenv.config({ path: './config/config.env' });
var PORT = process.env.PORT || '5000';
var mode = process.env.NODE_ENV || 'development';
// Rate limiting
var tenMinutes = 10 * 60 * 1000;
var RestfServer = /** @class */ (function () {
    function RestfServer() {
        this._app = express();
        this._setContentMiddlewares();
        this._setSecurityMiddlewares();
    }
    RestfServer.prototype.use = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (_a = this._app).use.apply(_a, args);
    };
    RestfServer.prototype.public = function () {
        this.use(express.static(path.join(__dirname, 'public')));
    };
    RestfServer.prototype.listen = function () {
        this._setEndpointNotFoundMiddleware();
        this._setGenericalErrorMiddleware();
        this._setUnhandledRejection();
        var message = ("Server running in " + mode + " mode on port " + PORT + "\n").cyan;
        this._app.listen(PORT, function () { return process.stdout.write(message); });
    };
    RestfServer.prototype._setSecurityMiddlewares = function () {
        this.use(helmet());
        this.use(xss());
        this.use(hpp());
        this.use(rateLimit({ windowMs: tenMinutes, max: 100 }));
        this.use(_cors_1["default"]());
    };
    RestfServer.prototype._setContentMiddlewares = function () {
        this.use(express.json());
        this.use(cookieParser());
        this.use(fileupload());
    };
    RestfServer.prototype._setEndpointNotFoundMiddleware = function () {
        this.use(function (_, res) {
            var error = 'Endpoint not found';
            res.status(404);
            return res.json({ error: error });
        });
    };
    RestfServer.prototype._setGenericalErrorMiddleware = function () {
        this.use(function (err, req, res, next) {
            var error = err.message || 'Server Error';
            res.status(err.statusCode || 500);
            res.json({ error: error });
            return next();
        });
    };
    RestfServer.prototype._setUnhandledRejection = function () {
        process.on('unhandledRejection', function (err) {
            process.stdout.write(("UnhandledRejection Error: " + err.message + "\n").red);
        });
    };
    return RestfServer;
}());
exports["default"] = RestfServer;
