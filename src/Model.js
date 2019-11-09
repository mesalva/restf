const database = require("./Database")

class BaseModel {
  constructor(table) {
    this.db = database(table)
  }

  all() {
    return this.db.select()
  }

  find(id) {
    return this.db
      .first()
      .where({ id })
      .then(data => (data ? data : Promise.reject(new Error("Not Found"))))
  }

  findBy(column, id) {
    return this.db.first().where({ [column]: id })
  }

  insertGetId(data) {
    return this.db
      .insert(data)
      .returning("id")
      .then(ids => ({ id: ids[0] }))
  }

  create(data) {
    return this.insertGetId(data)
  }

  update(data, whereClause) {
    const db = this.db.update(data)
    if (!whereClause) return db
    return db.where(whereClause)
  }

  static newDefaultData(data) {
    return { ...data, createdAt: new Date() }
  }
}

module.exports = BaseModel
