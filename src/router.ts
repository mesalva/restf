import { Router as ExpressRouter } from "express"
import RouteDocsRender, { RouteReport } from './routeDocsRender'
import RouteController, { addMiddleware } from './routeController'

export default class RestfRouter {
  router: ExpressRouter
  routes: Array<any>

  constructor() {
    this.router = ExpressRouter()
    this.routes = []
  }

  resources(endpoint: string, Controller: any) {
    const router: any = new RouteController(Controller)
    const routeReport: RouteReport = { path: endpoint, type: 'resources', subRoutes: []}
    const methods = RouteController.resourcesMethods(Controller)
    const addRoute = (path: string, type: string, method: string) => {
      if(!methods[type]) return null
      routeReport.subRoutes && routeReport.subRoutes.push({path, type, method})
      return router[method](path, type)
    }
    addRoute("/", "index", "get")
    addRoute("/", "create", "post")
    addRoute("/:id", "show", "get")
    addRoute("/:id", "update", "put")
    addRoute("/:id", "destroy", "delete")
    this.routes.push(routeReport)
    this.router.use(endpoint, router.listen())
    return this
  }

  docs(path: string){
    this.router.get(path, (req: Request, res: Response ) => new RouteDocsRender(req, res).render(this.routes))
  }

  post(path: string, method: string, Controller: any) {
    this.routes.push({ path, method: 'post', type: method})
    this.router.post(path, addMiddleware(Controller, method, path))
    return this
  }

  get(path: string, method: string, Controller: any) {
    this.routes.push({ path, method: 'get', type: method})
    this.router.get(path, addMiddleware(Controller, method, path))
    return this
  }

  listen() {
    return this.router
  }
}
