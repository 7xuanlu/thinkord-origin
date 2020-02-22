'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('BlocksFiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      blockId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Blocks',
          key: 'id'
        }
      },
      fileId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Files',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('BlocksFiles');
  }
};