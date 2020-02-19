const Sequelize = require('sequelize')

/**
 * Need to npm install sequelize and sqlite3
 * Please notice that the part of sqlite3 : npm install sqlite3 --runtime=electron --target=5.0.7 
 */
module.exports = new Sequelize({
    dialect: 'sqlite',
    storage: 'app/database.sqlite'
});