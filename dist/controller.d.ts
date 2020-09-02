import { Request, Response } from 'express';
import ControllerModels from './.ControllerModels';
interface ControllerOptions {
    status?: number;
}
export default class RestfController extends ControllerModels {
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
    protected send(data?: any): any;
    protected get routeParams(): any;
    protected get queryParams(): any;
    protected get body(): any;
    protected get headers(): any;
    protected get pathname(): any;
    protected get currentUser(): any;
    protected tokenToCredentials(token: string): string | object;
    protected serialize(...a: any[]): any;
    private sendWithMiddlewares;
    params(...permit: Array<string>): any;
    private sendEmptyResponses;
}
export {};
