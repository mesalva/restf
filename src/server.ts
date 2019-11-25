import 'colors'
import * as path from 'path'
import * as express from 'express'
import * as fileupload from 'express-fileupload'
import * as cookieParser from 'cookie-parser'
import * as helmet from 'helmet'
import * as rateLimit from 'express-rate-limit'
import * as hpp from 'hpp'
import * as dotenv from 'dotenv'
import cors from './.cors'

// @ts-ignore
import * as xss from 'xss-clean'

dotenv.config({ path: '../../config/config.env' })

const PORT: string = process.env.PORT || '5000'
const mode: string = process.env.NODE_ENV || 'development'

// Rate limiting
const tenMinutes: number = 10 * 60 * 1000

export default class RestfServer {
  _app: express.Express

  constructor() {
    this._app = express()
    this._setContentMiddlewares()
    this._setSecurityMiddlewares()
  }

  use(...args) {
    return this._app.use(...args)
  }

  public() {
    this.use(express.static(path.join(__dirname, 'public')))
  }

  listen() {
    this._setEndpointNotFoundMiddleware()
    this._setGenericalErrorMiddleware()
    this._setUnhandledRejection()
    const message = `Server running in ${mode} mode on port ${PORT}\n`.cyan
    this._app.listen(PORT, () => process.stdout.write(message))
  }

  _setSecurityMiddlewares() {
    this.use(helmet())
    this.use(xss())
    this.use(hpp())
    this.use(rateLimit({ windowMs: tenMinutes, max: 100 }))
    this.use(cors())
  }

  _setContentMiddlewares() {
    this.use(express.json())
    this.use(cookieParser())
    this.use(fileupload())
  }

  _setEndpointNotFoundMiddleware() {
    this.use((_: express.Request, res: express.Response) => {
      const error = 'Endpoint not found'
      res.status(404)
      return res.json({ error })
    })
  }

  _setGenericalErrorMiddleware() {
    this.use((err: any, req: express.Request, res: express.Response, next: any) => {
      const error = err.message || 'Server Error'
      res.status(err.statusCode || 500)
      res.json({ error })
      return next()
    })
  }

  _setUnhandledRejection() {
    process.on('unhandledRejection', function(err: Error) {
      process.stdout.write(`UnhandledRejection Error: ${err.message}\n`.red)
    })
  }
}

declare var __dirname: any
declare var process: any
