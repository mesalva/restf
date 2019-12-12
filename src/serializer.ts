import RestfController from './controller'

export default class RestfSerializer {
  controller?: RestfController

  constructor(controller = undefined) {
    this.controller = controller
  }

  public set(obj) {
    Object.entries(obj).forEach(([name, value]) => (this[name] = value))
  }

  public get(path) {
    if (!/\./.test(path)) return this[path]
    const paths = path.split('.')
    return this[paths[0]][paths[1]]
  }

  public static use(method){
    return new this()[method]
  }

  public static staticfy(...methods: string[]) {
    methods.forEach(method => {``
      this[method] = (...args: any[]) => new this()[method](...args)
    })
  }
}
