'use strict';
module.exports = (sequelize, DataTypes) => {
  const Folder = sequelize.define('Folder', {
    folder_name: DataTypes.STRING
  }, {});
  Folder.associate = function (models) {
    // associations can be defined here
    Folder.hasMany(models.Collection, { as: 'collections' })
  };
  return Folder;
};
