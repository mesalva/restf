import { Request, Response } from 'express';
interface ControllerOptions {
    status?: number;
}
export default class RestfController {
    req: Request | any;
    res: Response | any;
    sent?: boolean;
    permit?: Array<string>;
    constructor(req: Request | any, res: Response | any);
    status(code: number): this;
    respondWith(data: any, options?: ControllerOptions): any;
    private sendWithMiddlewares;
    params(...permit: Array<string>): any;
}
export {};
