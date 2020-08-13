import 'colors';
import * as express from 'express';
export default class RestfServer {
    _app: express.Express;
    afterMiddlewares: any[];
    options: any;
    constructor(options?: any);
    use(...args: any[]): any;
    apidocs(folder?: string, route?: string): void;
    public(folder?: string): void;
    listen(port?: number | string): void;
    useAfter(middleware: any): void;
    private setAfterMiddlewares;
    private setSecurityMiddlewares;
    private setContentMiddlewares;
    private setControllersMiddleware;
    private setEndpointNotFoundMiddleware;
    private setGeneralErrorMiddleware;
    private setUnhandledRejection;
}
