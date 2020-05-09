
const path = require('path');

let workpath = process.env.HOME + '//AppData//Roaming//thinkord'
module.exports = {
  "development": {
    "dialect": "sqlite",
    "storage": path.join(workpath,'database_dev.sqlite3'),
    "operatorsAliases": false
  },
  "test": {
    "dialect": "sqlite",
    "storage": path.join(workpath,'database_tst.sqlite3'),
    "operatorsAliases": false
  },
  "production": {
    "dialect": "sqlite",
    "storage": '../build/database_prd.sqlite3',
    "operatorsAliases": false
  }
}