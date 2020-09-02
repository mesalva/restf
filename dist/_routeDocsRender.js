"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class _routeDocsRender {
    constructor(req, res) {
        this.renderRow = (route) => {
            if (route.type === 'resources') {
                let content = `<div style="margin-top: 24px;">Resources: ${route.path}</div>`;
                route.subRoutes.forEach((r) => {
                    content += `<div style="margin-left: 24px;">${r.method} - ${r.type || ''}(${route.path}${r.path})</div>`;
                });
                this.lastBase = route.path.split('/')[1];
                return content;
            }
            this.lastBase = route.path.split('/')[1];
            return `<div style="margin-top: 24px;">${route.method} - ${route.type || ''}(${route.path})</div>`;
        };
        this.req = req;
        this.res = res;
    }
    render(routes) {
        const values = routes.map(this.renderRow).join('');
        return this.res.send(values);
    }
}
exports.default = _routeDocsRender;
