import { Router as ExpressRouter } from 'express';
import { RouteReport } from './_routeDocsRender';
import RestfController from './controller';
declare type MethodAlias = (path: string, controllerMethod: string) => any;
declare type RouterType = {
    routes?: any;
    get?: any;
} & ExpressRouter;
export default class RestfRouter {
    router: RouterType;
    routes: RouteReport[];
    get: MethodAlias;
    post: MethodAlias;
    delete: MethodAlias;
    update: MethodAlias;
    constructor();
    resources(endpoint: string, Controller: RestfController): this;
    docs(path: string): void;
    listen(): RouterType;
    private addMethod;
}
export {};
