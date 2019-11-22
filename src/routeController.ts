import { Router, Request, Response } from 'express'

export default class RouteController {
  Controller: any
  router: Router

  constructor(Controller: any) {
    this.Controller = Controller
    this.router = Router({ mergeParams: true })
  }

  addRoute(path: string, httpMethod: string, controllerMethod: string) {
    const route: any = this.router.route(path)
    return route[httpMethod](addMiddleware(this.Controller, controllerMethod, path))
  }

  get(path: string, controllerMethod: string) {
    return this.addRoute(path, 'get', controllerMethod)
  }

  post(path: string, controllerMethod: string) {
    return this.addRoute(path, 'post', controllerMethod)
  }

  put(path: string, controllerMethod: string) {
    return this.addRoute(path, 'put', controllerMethod)
  }

  delete(path: string, controllerMethod: string) {
    return this.addRoute(path, 'delete', controllerMethod)
  }

  listen() {
    return this.router
  }

  static resourcesMethods(Controller: any) {
    const allowedMethods = ['index', 'create', 'show', 'update', 'destroy']
    return Object.getOwnPropertyNames(Controller.prototype).reduce((obj: any, name: string) => {
      obj[name] = allowedMethods.includes(name)
      return obj
    }, {})
  }
}

export function addMiddleware(Controller: any, controllerMethod: string, path: string) {
  return (req: Request, res: Response) => {
    const controllerInstance = new Controller(req, res)
    const result = controllerInstance[controllerMethod](...middlewareParams(path, req))

    if (controllerInstance.sent) return result
    if (!isPromise(result)) return controllerInstance.respondWith(result)
    return result.then((r: any) => controllerInstance.respondWith(r)).catch(handleError(controllerInstance))
  }
}

function handleError(controllerInstance: any) {
  return (error: Error) => {
    let status = 500
    if (error.message === 'Not Found') status = 404
    return controllerInstance.respondWith({ message: error.message, status })
  }
}

function isPromise(obj: any) {
  if (!obj) return false
  return obj.then !== undefined
}

function middlewareParams(path: string, req: Request) {
  if (!/:/.test(path)) return []
  if (path === '/:id') return [req.params.id]
  return Object.values(req.params)
}
