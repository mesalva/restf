import { Router as ExpressRouter } from "express";
export default class RestfRouter {
    router: ExpressRouter;
    routes: Array<any>;
    constructor();
    resources(endpoint: string, Controller: any): this;
    docs(path: string): void;
    post(path: string, method: string, Controller: any): this;
    get(path: string, method: string, Controller: any): this;
    listen(): any;
}
