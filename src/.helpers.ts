import { Request, Response } from 'express'

export function addMiddleware(controllerName: string, controllerMethod: string, path: string) {
  return (req: Request | any, res: Response) => {
    try {
      const controllerInstance = new req.AllControllers[controllerName](req, res)
      const result = controllerInstance.run(controllerMethod, ...middlewareParams(path, req))

      if (controllerInstance.sent) return result
      if (!isPromise(result)) return controllerInstance.respondWith(result)
      return result.then((r: any) => controllerInstance.respondWith(r)).catch(handleError(controllerInstance))
    } catch (e) {
      console.log(e)
      res.status(500)
      res.send('')
    }
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

function middlewareParams(path: string, req: Request | any) {
  if (!/:/.test(path)) return []
  if (path === '/:id') return [req.params.id]
  if (/:\w+\*/.test(path)) return endingParam(path, req)
  return Object.values(req.params)
}

function endingParam(path, req) {
  const params = req.params
  const sufix = params['0']
  delete params['0']
  const lastParamName = path.replace(/.*\/:(\w+)\*$/, '$1')
  params[lastParamName] = params[lastParamName] + sufix
  return Object.values(params)
}
