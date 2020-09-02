import { Response } from 'express'

export default class _routeDocsRender {
  lastBase?: string

  constructor(private res: Response) {}

  render(routes: Array<any>) {
    const values = routes.map(this.renderRow).join('')
    return this.res.send(values)
  }

  renderRow = (route: any) => {
    if (route.type === 'resources') {
      let content = `<div style="margin-top: 24px;">Resources: ${route.path}</div>`
      route.subRoutes.forEach((r: RouteReport) => {
        content += `<div style="margin-left: 24px;">${r.method} - ${r.type || ''}(${route.path}${r.path})</div>`
      })
      this.lastBase = route.path.split('/')[1]
      return content
    }
    this.lastBase = route.path.split('/')[1]
    return `<div style="margin-top: 24px;">${route.method} - ${route.type || ''}(${route.path})</div>`
  }
}

export interface RouteReport {
  path: string
  type: string
  controller?: any
  method?: string
  subRoutes?: RouteReport[]
}
