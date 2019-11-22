import { Request, Response } from 'express';
interface ControllerOptions {
    status?: number;
}
export default class Controller {
    req: Request;
    res: Response;
    sent?: boolean;
    permit?: Array<string>;
    constructor(req: Request, res: Response);
    status(code: number): this;
    respondWith(data: any, options?: ControllerOptions): any;
    params(...permit: Array<string>): any;
}
export {};
