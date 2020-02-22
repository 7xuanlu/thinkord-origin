'use strict';
module.exports = (sequelize, DataTypes) => {
  const Collection = sequelize.define('Collection', {
    collectionName: DataTypes.STRING,
    display: DataTypes.BOOLEAN,
    folderId: DataTypes.INTEGER
  }, {});
  Collection.associate = function (models) {
    // associations can be defined here
    Collection.belongsTo(models.Folder, { foreignKey: 'folderId', as: 'folder' })
    Collection.hasMany(models.Block, { as: 'blocks' })
  };
  return Collection;
};