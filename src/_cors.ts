import { Request, Response, NextFunction } from 'express'

export default function _cors(hostsStr, allowHeaders) {
  return (req: Request, res: Response, next: NextFunction) => {
    const hosts = parseHosts(hostsStr)
    const origin: string = getOrigin(req.headers)
    if (hosts.length === 0 || !origin) {
      setCors(res, '*')
      return next()
    }
    const domain = origin.replace(/http(s)?:\/\//, '')
    if (!hosts.includes(domain)) {
      res.status(403)
      return res.send()
    }
    setCors(res, origin, allowHeaders)
    if (req.method !== 'OPTIONS') return next()
    return res.send()
  }
}

function parseHosts(hosts) {
  if (Array.isArray(hosts)) return hosts
  if (typeof hosts === 'string') return hosts.replace(/\s/g, '').split(',')
  return []
}

function getOrigin(headers: any): string {
  return headers.origin || ''
}

function setCors(res: Response, origin: string, allowHeaders: string = '*') {
  res.setHeader('Access-Control-Allow-Headers', allowHeaders)
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,OPTIONS,HEADERS')
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
}
