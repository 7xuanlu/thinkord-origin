'use strict';
module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    fileName: DataTypes.STRING
  }, {});
  File.associate = function (models) {
    // associations can be defined here
    File.belongsToMany(models.Block, { through: 'BlocksFiles', foreignKey: 'fileId', as: 'blocks' })
  };
  return File;
};
