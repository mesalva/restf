class Controller {
  constructor(req, res) {
    this.req = req
    this.res = res
  }

  status(code) {
    this.res.status(code)
    return this
  }

  respondWith(data, options = {}) {
    if (this.sent) return null
    if (options.status) this.res.status(options.status)
    this.sent = true
    if (options.status || data) return this.res.json(data)

    this.res.status(204)
    return this.res.send()
  }

  params(...permit) {
    const controllerPermit = this.permit
    if (permit.length === 0) {
      if (controllerPermit) permit = controllerPermit
      else permit = Object.keys(this.req.body)
    }
    return objectFilter(this.req.body, permit)
  }
}

//TODO melhorar isso, talvez colocar no prototype de object
function objectFilter(obj, fields) {
  return fields.reduce((result, field) => {
    if (obj[field]) result[field] = obj[field]
    return result
  }, {})
}

module.exports = Controller
