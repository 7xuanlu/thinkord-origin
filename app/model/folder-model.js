const Sequelize = require('sequelize')
const db = require('../config/database')
const validator = require('validator')

const Folder = db.define('folder', {
    folder_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    folder_name: {
        type: Sequelize.STRING,
        allowNull: false
    }
},{
    timestamp:true
})


module.exports = Folder