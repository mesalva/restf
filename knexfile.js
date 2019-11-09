const path = require("path")
const dotenv = require("dotenv")

dotenv.config({ path: path.join(__dirname, ".env") })

module.exports = {
  development: {
    client: "postgresql",
    connection: process.env.DATABASE_URL + "?ssl=true",
    searchPath: ["knex", "public"],
    migrations: {
      directory: "../db/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
  },
}
