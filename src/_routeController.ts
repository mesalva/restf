import { Router } from 'express'
import { addMiddleware } from './_helpers'

export default class _routeController {
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
