import { Request, Response } from 'express'

interface ControllerOptions {
  status?: number
}

export default class Controller {
  req: Request
  res: Response
  sent?: boolean
  permit?: Array<string>

  constructor(req: Request, res: Response) {
    this.req = req
    this.res = res
  }

  status(code: number) {
    this.res.status(code)
    return this
  }

  respondWith(data: any, options: ControllerOptions = {}) {
    if (this.sent) return null
    if (options.status) this.res.status(options.status)
    this.sent = true
    if (options.status || data) return this.res.json(data)

    this.res.status(204)
    return this.res.send()
  }

  params(...permit: Array<string>) {
    const controllerPermit = this.permit
    if (controllerPermit) permit = [...controllerPermit, ...permit]
    if (permit.length === 0) return this.req.body
    return objectFilter(this.req.body, permit)
  }
}

function objectFilter(obj: any, fields: Array<string>) {
  return fields.reduce((result: any, field: string) => {
    if (obj[field]) result[field] = obj[field]
    return result
  }, {})
}
