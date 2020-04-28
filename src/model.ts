import database from './.database'

export default class RestfModel {
  db: any

  constructor(protected table: string) {
    this.db = database(table)
    this.db.constructor.prototype.raw = async (query: string, options: any[] = []) => {
      return database.raw(query.replace(/\n/g, ' '), options).then(({ rows }) => rows)
    }
    this.db.constructor.prototype.firstParsed = (...args) => {
      return this.db.first(...args).then(parseSingle)
    }
    this.db.constructor.prototype.selectParsed = (...args) => {
      return this.db.select(...args).then(parseMulti)
    }
    this.db.constructor.prototype.innerJoinWithManyAnds = (table, ...args) => {
      return this.db.innerJoin(table, function() {
        const [a, b, c, d] = args
        this.on(a, '=', b).andOn(c, '=', d)
      })
    }
    this.db.constructor.insertReturning = (content, ...returns) => {
      return this.db
        .insert(content)
        .returning('id')
        .then(([id]) => id)
        .then(id =>
          database(table)
            .where({ id })
            .first(...returns)
        )
    }
  }

  all() {
    return this.db.select()
  }

  find(id: number) {
    return this.db
      .first()
      .where({ id })
      .then((data: any) => (data ? data : Promise.reject(new Error('Content Not Found'))))
  }

  findBy(column: string, value: any) {
    return this.db
      .first()
      .where({ [column]: value })
      .then((data: any) => (data ? data : Promise.reject(new Error('Content Not Found'))))
  }

  insertGetId(data: any) {
    return this.db
      .insert(data)
      .returning('id')
      .then((ids: Array<number>) => ({ id: ids[0] }))
  }

  create(data: object) {
    return this.insertGetId(data)
  }

  update(data: object, whereClause?: any) {
    const db = this.db.update(data)
    if (!whereClause) return db
    return db.where(whereClause)
  }

  delete(id: number) {
    return this.db
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
