import { Router } from "express";
export default class RouteController {
    Controller: any;
    router: Router;
    constructor(Controller: any);
    addRoute(path: string, httpMethod: string, controllerMethod: string): any;
    get(path: string, controllerMethod: string): any;
    post(path: string, controllerMethod: string): any;
    put(path: string, controllerMethod: string): any;
    delete(path: string, controllerMethod: string): any;
    listen(): any;
    static resourcesMethods(Controller: any): any;
}
export declare function addMiddleware(Controller: any, controllerMethod: string, path: string): (req: any, res: any) => any;
