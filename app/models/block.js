'use strict';
module.exports = (sequelize, DataTypes) => {
  const Block = sequelize.define('Block', {
    blockName: DataTypes.STRING,
    blockType:{ 
      type:DataTypes.ENUM,
      values: ['text','image','audio','video']
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    bookmark: DataTypes.BOOLEAN,
    collectionId: DataTypes.INTEGER
  }, {});
  Block.associate = function (models) {
    // associations can be defined here
    Block.belongsTo(models.Collection, { foreignKey: 'collectionId', as: 'collection' })
    Block.belongsToMany(models.File, { through: 'BlocksFiles', foreignKey: 'blockId', as: 'files' })
  };
  return Block;
};
