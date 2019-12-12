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
    constructor(req: Request | any, res: Response | any);
    run(method: string, ...args: any[]): any;
    protected status(code: number): this;
    protected respondWith(data: any, options?: ControllerOptions): any;
    protected serialize(...a: any[]): any;
    private sendWithMiddlewares;
    params(...permit: Array<string>): any;
}
export {};
