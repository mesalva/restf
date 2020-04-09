import database from './.database'

export default class RestfModel {
  db: any

  constructor(table: string) {
    this.db = database(table)
    this.db.raw = async (query: string, options: any[] = []) => {
      return database.raw(query.replace(/\n/g, ' '), options).then(({ rows }) => rows)
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
