"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const _cors_1 = __importDefault(require("./_cors"));
if (fs_1.default.existsSync('./.env'))
    dotenv_1.default.config({ path: './.env' });
if (fs_1.default.existsSync('./config/config.env'))
    dotenv_1.default.config({ path: './config/config.env' });
const mode = process.env.NODE_ENV || 'development';
class RestfServer {
    constructor(options = {}) {
        this._app = express_1.default();
        this.options = options;
        this.setContentMiddlewares();
        this.setControllersMiddleware();
        this.setSecurityMiddlewares();
        this.setAfterMiddlewares();
    }
    use(...args) {
        this._app.use((req, _res, next) => {
            next();
        });
        return this._app.use(...args);
    }
    apidocs(folder = 'doc', route) {
        if (!route)
            route = folder;
        this._app.get(`/${route}`, (_, res) => res.sendFile(`${process.cwd()}/${folder}/index.html`));
    }
    public(folder = 'public') {
        this.use(express_1.default.static(path_1.default.join(__dirname, folder)));
    }
    listen(port = 5000) {
        this.setEndpointNotFoundMiddleware();
        this.setGeneralErrorMiddleware();
        this.setUnhandledRejection();
        const DEFAULT_PORT = process.env.PORT || port.toString();
        const message = `Server running in ${mode} mode on port ${DEFAULT_PORT}\n`.cyan;
        this._app.listen(DEFAULT_PORT, () => process.stdout.write(message));
    }
    useAfter(middleware) {
        this.afterMiddlewares.push(middleware);
    }
    setAfterMiddlewares() {
        this.afterMiddlewares = [];
        this.use((req, res, next) => {
            req.afterMiddlewares = this.afterMiddlewares;
            return next();
        });
    }
    setSecurityMiddlewares() {
        this.use(helmet_1.default());
        this.use(xss_clean_1.default());
        this.use(hpp_1.default());
        this.use(_cors_1.default(this.options.allowHosts, this.options.allowHeaders));
    }
    setContentMiddlewares() {
        this.use(express_1.default.json());
        this.use(cookie_parser_1.default());
        this.use(express_fileupload_1.default());
    }
    setControllersMiddleware() {
        this.use((req, _res, next) => {
            try {
                req.AllControllers = require('./.allControllers');
            }
            catch (e) {
                console.log('error to require .allControllers\n\n', e);
            }
            next();
        });
    }
    setEndpointNotFoundMiddleware() {
        this.use((_, res) => {
            const error = 'Endpoint not found';
            res.status(404);
            return res.json({ error });
        });
    }
    setGeneralErrorMiddleware() {
        this.use((err, req, res, next) => {
            const error = err.message || 'Server Error';
            res.status(err.statusCode || 500);
            res.json({ error });
            console.log(error);
            return next();
        });
    }
    setUnhandledRejection() {
        process.on('unhandledRejection', function (err) {
            process.stdout.write(`UnhandledRejection Error: ${err.message}\n`.red);
        });
    }
}
exports.default = RestfServer;
