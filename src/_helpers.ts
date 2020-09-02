import { Request, Response } from 'express'

export function addMiddleware(controllerName: string, controllerMethod: string, path: string) {
  return (req: Request | any, res: Response) => {
    try {
      fixEndingParams(req.params)
      const controllerInstance = new req.AllControllers[controllerName]()
      controllerInstance.req = req
      controllerInstance.res = res
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

function fixEndingParams(params) {
  if (!params[0]) return undefined
  const endingParam = params[0]
  delete params[0]
  const lastKey = Object.keys(params).pop()
  params[lastKey] += endingParam
}

function handleError(controllerInstance: any) {
  return (error: Error) => {
    let statusCode = 500
    if (error.message === 'Not Found') statusCode = 404
    return controllerInstance.respondWith({ message: error.message, statusCode })
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
  const sufix = params['0'] || ''
  delete params['0']
  const lastParamName = Object.keys(params).pop()
  const lastParam = params[lastParamName] || ''
  params[lastParamName] = lastParam + sufix
  return Object.values(params)
}
