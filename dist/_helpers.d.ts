import { Response } from 'express';
export declare function addMiddleware(controllerName: string, controllerMethod: string, path: string): (req: any, res: Response<any>) => any;
