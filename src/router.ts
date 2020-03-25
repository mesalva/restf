import { Router as ExpressRouter } from 'express'
import RouteDocsRender, { RouteReport } from './.routeDocsRender'
import RouteController from './.routeController'
import { addMiddleware } from './.helpers'
import RestfController from './controller'

type MethodAlias = (path: string, controllerMethod: string) => any

export default class RestfRouter {
  router: ExpressRouter
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
    const router: any = new RouteController(Controller)
    const routeReport: RouteReport = { path: endpoint, type: 'resources', subRoutes: [] }
    const methods = RouteController.resourcesMethods(Controller)
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
    this.router.get(path, (req: Request, res: Response) => new RouteDocsRender(req, res).render(this.routes))
  }

  public listen() {
    return this.router
  }

  private addMethod(httpMethod) {
    return (path: string, controllerMethod: string) => {
      const [controllerName, methodName] = controllerMethod.split(/[@.]/)
      this.routes.push({ path, method: httpMethod, type: methodName })
      this.router[httpMethod](path, addMiddleware(controllerName, methodName, path))
      return this
    }
  }
}
