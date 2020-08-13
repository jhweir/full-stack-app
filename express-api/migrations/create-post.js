'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      subType: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      creatorId: {
        type: Sequelize.INTEGER
      },
      text: {
        type: Sequelize.TEXT
      },
      url: {
        type: Sequelize.TEXT
      },
      imagePath: {
        type: Sequelize.TEXT
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
    return queryInterface.dropTable('Posts');
  }
};