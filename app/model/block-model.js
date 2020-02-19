const Sequelize = require('sequelize')
const db = require('../config/database')
const validator = require('validator')

module.exports = function (db, DataTypes) {
    const Block = db.define('block', {
        block_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        block_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        block_type: {
            type: DataTypes.ENUM,
            allowNull: true
        },
        title: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        bookmark: {
            type: DataTypes.BOOLEAN
        },
        timeline_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: Timeline,
                key: 'timeline_id'
            }
        }
    }, {
        timestamps: true,
        tableName: 'block'
    });

    Block.associate = (models) => {
        Block.belongsToMany(models.File, { as: 'BlocksForFile', through: models.BlockFile, foreignKey: 'block_id' })
    }

    return Block
}
