import { Request, Response } from 'express';
export default class RouteDocsRender {
    req: Request;
    res: Response;
    lastBase?: string;
    constructor(req: Request, res: Response);
    render(routes: Array<any>): any;
    renderRow: (route: any) => string;
}
export interface RouteReport {
    path: string;
    type: string;
    controller?: any;
    method?: string;
    subRoutes?: RouteReport[];
}
