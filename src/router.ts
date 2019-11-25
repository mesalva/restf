import { Router as ExpressRouter } from "express"
import RouteDocsRender, { RouteReport } from './.routeDocsRender'
import RouteController, { addMiddleware } from './.routeController'
import RestfController from './controller'

type MethodAlias = (path: string, Controller: any, controllerMethod: string) => any;

export default class RestfRouter {
  router: ExpressRouter
  routes: Array<RouteReport>
  get: MethodAlias
  post: MethodAlias
  delete: MethodAlias
  update: MethodAlias

  constructor() {
    this.router = ExpressRouter()
    this.routes = []
    this.get = this._addMethod('get')
    this.post = this._addMethod('post')
    this.delete = this._addMethod('delete')
    this.update = this._addMethod('update')
  }

  resources(endpoint: string, Controller: RestfController) {
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

  listen() {
    return this.router
  }

  private _addMethod(httpMethod){
    return (path: string, Controller: any, controllerMethod: string) => {
      this.routes.push({ path, method: httpMethod, type: controllerMethod})
      this.router[httpMethod](path, addMiddleware(Controller, controllerMethod, path))
      return this
    }
  }
}
