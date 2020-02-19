const Sequelize = require('sequelize')
const db = require('../config/database')
const validator = require('validator')

module.exports = function (sequelize, DataTypes) {
    const File = sequelize.define('file', {
        file_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        file_name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'file'
    });

    File.associate = (models) => {
        File.belongsToMany(models.Block, { as: 'FileInBlock', through: models.BlockFile, foreignKey: 'file_id' });
    }
    return File;
};