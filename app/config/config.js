module.exports = {
  "development": {
    "dialect": "sqlite",
    "storage": "./database_dev.sqlite3",
    "operatorsAliases": false
  },
  "test": {
    "dialect": "sqlite",
    "storage": "./database_tst.sqlite3",
    "operatorsAliases": false
  },
  "production": {
    "dialect": "sqlite",
    "storage": "./database_prd.sqlite3",
    "operatorsAliases": false
  }
}