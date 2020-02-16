'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Branches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      creator: {
        type: Sequelize.STRING
      },
      mods: {
        type: Sequelize.STRING
      },
      followers: {
        type: Sequelize.STRING
      },
      tags: {
        type: Sequelize.STRING
      },
      parent_branches: {
        type: Sequelize.STRING
      },
      total_likes: {
        type: Sequelize.INTEGER
      },
      total_comments: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Branches');
  }
};