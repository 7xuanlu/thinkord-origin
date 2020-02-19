const Sequelize = require('sequelize')
const db = require('../config/database')
const validator = require('validator')

const Timeline = db.define('timeline', {
    timeline_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    timeline_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    display: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    folder_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: Folder,
            key: 'folder_id'
        }
    }
})


module.exports = Timeline