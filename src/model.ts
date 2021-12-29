import _database from './_database'

let client = null

export default class RestfModel {
  _db: any

  protected route?: string

  constructor(protected options?: string | any) {}

  protected get db() {
    if (this._db) return this._db
    let table: string = typeof this.options === 'string' ? this.options : ''
    if (!this.options) table = this.route
    this._db = _database(table)
    this._db.constructor.prototype.raw = async (query: string, options: any[] = []) => {
      return _database.raw(query.replace(/\n/g, ' '), options).then(({ rows }) => rows)
    }
    this._db.constructor.prototype.firstParsed = (...args) => {
      return this._db.first(...args).then(parseSingle)
    }
    this._db.constructor.prototype.selectParsed = (...args) => {
      return this._db.select(...args).then(parseMulti)
    }
    this._db.constructor.prototype.innerJoinWithManyAnds = (table, ...args) => {
      return this._db.innerJoin(table, function() {
        const [a, b, c, d] = args
        this.on(a, '=', b).andOn(c, '=', d)
      })
    }
    this._db.constructor.insertReturning = (content, ...returns) => {
      return this._db
        .insert(content)
        .returning('id')
        .then(([id]) => id)
        .then(id =>
          _database(table)
            .where({ id })
            .first(...returns)
        )
    }
    return this._db
  }

  protected async rawSelect(query: string, params: any[] = []) {
    if (!client) {
      try {
        const Client = require('pg').Client
        client = new Client({ connectionString: process.env.DATABASE_URL + '?ssl=true' })
      } catch (e) {
        console.log('To run raw queries you must install "pg" lib')
        throw e
      }
    }
    await client.connect()
    if (query.toLowerCase().substr(0, 6) !== 'select') {
      throw new Error('Only selects are allowed')
    }
    const res = await client.query(query, [...params])
    client.end()
    return res.rows
  }

  protected async rawSelectFirst(query: string, params: any[]) {
    const result = await this.rawSelect(query, params)
    if (result && Array.isArray(result) && result.length > 0) return result[0]
    return null
  }

  all() {
    return this._db.select()
  }

  find(id: number) {
    return this._db
      .first()
      .where({ id })
      .then((data: any) => (data ? data : Promise.reject(new Error('Content Not Found'))))
  }

  findBy(column: string, value: any) {
    return this._db
      .first()
      .where({ [column]: value })
      .then((data: any) => (data ? data : Promise.reject(new Error('Content Not Found'))))
  }

  insertGetId(data: any) {
    return this._db
      .insert(data)
      .returning('id')
      .then((ids: Array<number>) => ({ id: ids[0] }))
  }

  create(data: object) {
    return this.insertGetId(data)
  }

  update(data: object, whereClause?: any) {
    const db = this._db.update(data)
    if (!whereClause) return db
    return db.where(whereClause)
  }

  delete(id: number) {
    return this._db
      .where({ id })
      .delete()
      .then(() => ({ id }))
  }

  static newDefaultData(data: object) {
    return { ...data, createdAt: new Date() }
  }
}

function parseSingle(data) {
  if (!data) return data
  const data2: any = {}
  for (let field in data) {
    if (field.match('_')) {
      const [name, subName] = field.split('_')
      if (!data2[name]) data2[name] = {}
      data2[name][subName] = data[field]
    } else {
      data2[field] = data[field]
    }
  }
  return data2
}

function parseMulti(data) {
  if (!data) return data
  return data.map(parseSingle)
}
