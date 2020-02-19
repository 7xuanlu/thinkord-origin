const Sequelize = require('sequelize')
const db = require('../config/database')
const validator = require('validator')

module.exports = function (sequelize, DataTypes) {
    const BlockFile = db.define('blockfile', {
        blockfile_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        block_id: {
            type: DataTypes.UUID,
            primaryKey: false,
            references: {
                model: 'block',
                key: 'block_id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
        },
        file_id: {
            type: DataTypes.UUID,
            primaryKey: false,
            references: {
                model: 'file',
                key: 'file_id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
        },
    }, {
        timestamp: true,
        tableName: 'blockfile'
    })

    BlockFile.associate = (models) => {
        BlockFile.belongsTo(models.Block, { foreignKey: 'block_id', targetKey: 'block_id', as: 'Block' })
        BlockFile.belongsTo(models.File, { foreginKey: 'file_id', targetKey: 'file_id', as: 'File' });
    }

    return BlockFile
}