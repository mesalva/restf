import { Router as ExpressRouter } from "express";
export default class Router {
    router: ExpressRouter;
    routes: Array<any>;
    constructor();
    resources(path: string, Controller: any): this;
    docs(path: string): void;
    post(path: string, method: string, Controller: any): this;
    get(path: string, method: string, Controller: any): this;
    listen(): any;
}
