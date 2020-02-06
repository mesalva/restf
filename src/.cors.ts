import { Request, Response, NextFunction } from 'express'

export default function cors(openCors = false) {
  return (req: Request, res: Response, next: NextFunction) => {
    const knownHosts = process.env.KNOWN_HOSTS || ''
    const hosts = knownHosts.replace(/\s/g, '').split(',')
    const origin: string = getOrigin(req.headers)
    if (openCors || !origin) {
      setCors(res, '*')
      return next()
    }
    const domain = origin.replace(/http(s)?:\/\//, '')
    if (!hosts.includes(domain)) {
      res.status(403)
      return res.send()
    }
    setCors(res, origin)
    if (req.method !== 'OPTIONS') return next()
    return res.send()
  }
}

function getOrigin(headers: any): string {
  return headers.origin || ''
}

function setCors(res: Response, origin: string) {
  res.setHeader('Access-Control-Allow-Headers', 'access-control-allow-headers,cache,content-type')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT')
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
}
