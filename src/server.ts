import 'colors'
import * as fs from 'fs'
import * as path from 'path'
import * as express from 'express'
import * as fileupload from 'express-fileupload'
import * as cookieParser from 'cookie-parser'
import * as helmet from 'helmet'
import * as hpp from 'hpp'
import * as dotenv from 'dotenv'
import cors from './.cors'

// @ts-ignore
import * as xss from 'xss-clean'

if (fs.existsSync('./.env')) dotenv.config({ path: './.env' })
if (fs.existsSync('./config/config.env')) dotenv.config({ path: './config/config.env' })

const PORT: string = process.env.PORT || '5000'
const mode: string = process.env.NODE_ENV || 'development'

// Rate limiting
const tenMinutes: number = 10 * 60 * 1000

export default class RestfServer {
  _app: express.Express
  afterMiddlewares: any[]
  options: any

  constructor(options: any = {}) {
    this._app = express()
    this.options = options
    this.setContentMiddlewares()
    this.setControllersMiddleware()
    this.setSecurityMiddlewares()
    this.setAfterMiddlewares()
  }

  public use(...args) {
    return this._app.use(...args)
  }

  public apidocs(folder: string = 'doc', route?: string) {
    if (!route) route = folder
    this._app.get(`/${route}`, (_, res) => res.sendFile(`${process.cwd()}/${folder}/index.html`))
  }

  public public(folder: string = 'public') {
    this.use(express.static(path.join(__dirname, folder)))
  }

  public listen() {
    this.setEndpointNotFoundMiddleware()
    this.setGeneralErrorMiddleware()
    this.setUnhandledRejection()
    const message = `Server running in ${mode} mode on port ${PORT}\n`.cyan
    this._app.listen(PORT, () => process.stdout.write(message))
  }

  public useAfter(middleware) {
    this.afterMiddlewares.push(middleware)
  }

  private setAfterMiddlewares() {
    this.afterMiddlewares = []
    this.use((req, res, next) => {
      req.afterMiddlewares = this.afterMiddlewares
      return next()
    })
  }

  private setSecurityMiddlewares() {
    this.use(helmet())
    this.use(xss())
    this.use(hpp())
    this.use(cors(this.options.allowHosts, this.options.allowHeaders))
  }

  private setContentMiddlewares() {
    this.use(express.json())
    this.use(cookieParser())
    this.use(fileupload())
  }

  private setControllersMiddleware() {
    this.use((req, _res, next) => {
      try{
        req.AllControllers = require('./.allControllers')
      }
      catch (e) {
       console.log('error to require .allControllers')
      }
      next()
    })
  }

  private setEndpointNotFoundMiddleware() {
    this.use((_: express.Request, res: express.Response) => {
      const error = 'Endpoint not found'
      res.status(404)
      return res.json({ error })
    })
  }

  private setGeneralErrorMiddleware() {
    this.use((err: any, req: express.Request, res: express.Response, next: any) => {
      const error = err.message || 'Server Error'
      res.status(err.statusCode || 500)
      console.log(err)
      res.json({ error })
      return next()
    })
  }

  private setUnhandledRejection() {
    process.on('unhandledRejection', function(err: Error) {
      process.stdout.write(`UnhandledRejection Error: ${err.message}\n`.red)
    })
  }
}

//TODO criar classe para isso?

declare var __dirname: any
declare var process: any
