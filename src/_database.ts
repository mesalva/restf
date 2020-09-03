import path from 'path'
import knex from 'knex'

// @ts-ignore
const fullPath = (p: string) => path.join(__dirname, '../..', p)
const knexfile = getKnexfile()

// @ts-ignore
const environment = process.env.NODE_ENV || 'development'

function getKnexfile() {
  try {
    return require(fullPath('knexfile'))
  } catch (e) {
    return require(fullPath('config/knexfile'))
  }
}

// @ts-ignore
const _database = knex(knexfile[environment])
export default _database
