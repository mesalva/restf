import { Response } from 'express';
export default class _routeDocsRender {
    private res;
    lastBase?: string;
    constructor(res: Response);
    render(routes: Array<any>): Response<any>;
    renderRow: (route: any) => string;
}
export interface RouteReport {
    path: string;
    type: string;
    controller?: any;
    method?: string;
    subRoutes?: RouteReport[];
}
