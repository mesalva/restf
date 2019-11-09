const path = require("path")
const knex = require("knex")

const fullPath = p => path.join(__dirname,'../..',p)
const knexfile = getKnexfile()

const environment = process.env.NODE_ENV || "development"

const database = knex(knexfile[environment])

function getKnexfile(){
  try{
    return require(fullPath("knexfile"))
  }
  catch(e){
    return require(fullPath("config/knexfile"))
  }
}

module.exports = database
