import { Router as ExpressRouter } from 'express';
import { RouteReport } from './.routeDocsRender';
import RestfController from './controller';
declare type MethodAlias = (path: string, Controller: any, controllerMethod: string) => any;
export default class RestfRouter {
    router: ExpressRouter;
    routes: RouteReport[];
    get: MethodAlias;
    post: MethodAlias;
    delete: MethodAlias;
    update: MethodAlias;
    constructor();
    resources(endpoint: string, Controller: RestfController): this;
    docs(path: string): void;
    listen(): any;
    private addMethod;
}
export {};
