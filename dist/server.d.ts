import 'colors';
import * as express from 'express';
export default class RestfServer {
    _app: express.Express;
    constructor();
    use(...args: any[]): any;
    public(): void;
    listen(): void;
    _setSecurityMiddlewares(): void;
    _setContentMiddlewares(): void;
    _setEndpointNotFoundMiddleware(): void;
    _setGenericalErrorMiddleware(): void;
    _setUnhandledRejection(): void;
}
