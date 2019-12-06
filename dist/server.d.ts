import 'colors';
import * as express from 'express';
export default class RestfServer {
    _app: express.Express;
    afterMiddlewares: any[];
    constructor();
    use(...args: any[]): any;
    apidocs(folder?: string): void;
    public(folder?: string): void;
    listen(): void;
    useAfter(middleware: any): void;
    private setAfterMiddlewares;
    private setSecurityMiddlewares;
    private setContentMiddlewares;
    private setEndpointNotFoundMiddleware;
    private setGeneralErrorMiddleware;
    private setUnhandledRejection;
}
