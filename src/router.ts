import { Router as ExpressRouter } from 'express'
import _routeDocsRender, { RouteReport } from './_routeDocsRender'
import _routeController from './_routeController'
import { addMiddleware } from './_helpers'
import RestfController from './controller'

type MethodAlias = (path: string, controllerMethod: string) => any
type RouterType = { 
  routes?: any
  get?: any
} & ExpressRouter

export default class RestfRouter {
  router: RouterType
  routes: RouteReport[]
  get: MethodAlias
  post: MethodAlias
  delete: MethodAlias
  update: MethodAlias

  constructor() {
    this.router = ExpressRouter()
    this.routes = []
    this.get = this.addMethod('get')
    this.post = this.addMethod('post')
    this.delete = this.addMethod('delete')
    this.update = this.addMethod('update')
  }

  public resources(endpoint: string, Controller: RestfController) {
    const router: any = new _routeController(Controller)
    const routeReport: RouteReport = { path: endpoint, type: 'resources', subRoutes: [], controller: Controller }
    const methods = _routeController.resourcesMethods(Controller)
    const addRoute = (path: string, type: string, method: string) => {
      if (!methods[type]) return null
      routeReport.subRoutes && routeReport.subRoutes.push({ path, type, method })
      return router[method](path, type)
    }
    addRoute('/', 'index', 'get')
    addRoute('/', 'create', 'post')
    addRoute('/:id', 'show', 'get')
    addRoute('/:id', 'update', 'put')
    addRoute('/:id', 'destroy', 'delete')
    this.routes.push(routeReport)
    this.router.use(endpoint, router.listen())
    return this
  }

  public docs(path: string) {
    this.router.get(path, (_, res) => new _routeDocsRender(res).render(this.routes))
  }

  public listen() {
    this.router.routes = this.routes.map(
      route => `router.${route.method}('${route.path}', '${route.controller}.${route.type}')`
    )
    return this.router
  }

  private addMethod(httpMethod) {
    return (path: string, controllerMethod: string) => {
      const [controllerName, methodName] = controllerMethod.split(/[@.]/)
      this.routes.push({ path, method: httpMethod, type: methodName, controller: controllerName })
      this.router[httpMethod](path, addMiddleware(controllerName, methodName, path))
      return this
    }
  }
}
