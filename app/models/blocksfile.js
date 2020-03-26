'use strict';
module.exports = (sequelize, DataTypes) => {
  const BlocksFile = sequelize.define('BlocksFile', {
    blockId: DataTypes.INTEGER,
    fileId: DataTypes.INTEGER
  }, {});
  BlocksFile.associate = function (models) {
    // associations can be defined here
    BlocksFile.belongsTo(models.Block, { foreignKey: 'blockId' })
    BlocksFile.belongsTo(models.File, { foreignKey: 'fileId' })
  };
  return BlocksFile;
};
