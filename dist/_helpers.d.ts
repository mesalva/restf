import { Request, Response } from 'express';
export declare function addMiddleware(controllerName: string, controllerMethod: string, path: string): (req: Request | any, res: Response) => any;
