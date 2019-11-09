const express = require("express")

class RouteController {
  constructor(Controller) {
    this.Controller = Controller
    this.router = express.Router({ mergeParams: true })
  }

  addRoute(path, httpMethod, controllerMethod) {
    return this.router
      .route(path)
      [httpMethod](this.addMiddleware(controllerMethod, path))
  }

  addMiddleware(controllerMethod, path) {
    return (req, res) => {
      const controllerInstance = new this.Controller(req, res)
      const result = controllerInstance[controllerMethod](
        ...middlewareParams(path, req)
      )

      if (controllerInstance.sent) return result
      if (!isPromise(result)) return controllerInstance.respondWith(result)
      return result
        .then(r => controllerInstance.respondWith(r))
        .catch(handleError(controllerInstance))
    }
  }

  get(path, controllerMethod) {
    return this.addRoute(path, "get", controllerMethod)
  }

  post(path, controllerMethod) {
    return this.addRoute(path, "post", controllerMethod)
  }

  put(path, controllerMethod) {
    return this.addRoute(path, "put", controllerMethod)
  }

  delete(path, controllerMethod) {
    return this.addRoute(path, "delete", controllerMethod)
  }

  listen() {
    return this.router
  }

  static resourcesMethods(Controller) {
    const allowedMethods = ["index", "create", "show", "update", "destroy"]
    return Object.getOwnPropertyNames(Controller.prototype).reduce(
      (obj, name) => {
        obj[name] = allowedMethods.includes(name)
        return obj
      },
      {}
    )
  }
}

class Router {
  constructor() {
    this.router = express.Router()
  }

  resources(path, Controller) {
    const router = new RouteController(Controller)

    const methods = RouteController.resourcesMethods(Controller)
    if (methods.index) router.get("/", "index")
    if (methods.create) router.post("/", "create")
    if (methods.show) router.get("/:id", "show")
    if (methods.update) router.put("/:id", "update")
    if (methods.destroy) router.delete("/:id", "destroy")

    this.router.use(path, router.listen())
    return this
  }

  listen() {
    return this.router
  }
}

function handleError(controllerInstance) {
  return error => {
    let status = 500
    if (error.message === "Not Found") status = 404
    return controllerInstance.respondWith(
      { message: error.message },
      { status }
    )
  }
}

function isPromise(obj) {
  if (!obj) return false
  return obj.then !== undefined
}

function middlewareParams(path, req) {
  if (path === "/:id") {
    return [req.params.id]
  }
  return []
}

module.exports = Router
