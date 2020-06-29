import { Request, Response } from 'express';
interface ControllerOptions {
    status?: number;
}
export default class RestfController {
    req: Request | any;
    res: Response | any;
    sent?: boolean;
    permit?: Array<string>;
    currentMethod?: string;
    protected static serialize: any;
    constructor(req?: Request | any, res?: Response | any);
    protected cached(path: string, method: Function): Promise<any>;
    protected clearCache(path: string): Promise<boolean>;
    run(method: string, ...args: any[]): any;
    protected status(code: number): this;
    protected respondWith(data?: any, options?: ControllerOptions): any;
    protected get currentUser(): any;
    protected tokenToCredentials(token: string): any;
    protected serialize(...a: any[]): any;
    private sendWithMiddlewares;
    params(...permit: Array<string>): any;
    get routeParams(): any;
    get queryParams(): any;
    get body(): any;
}
export {};
