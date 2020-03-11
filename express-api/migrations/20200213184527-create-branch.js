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
      creator: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      handle: {
        type: Sequelize.STRING,
        unique: true
      },
      flag_image: {
        type: Sequelize.STRING
      },
      cover_image: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      mods: {
        type: Sequelize.STRING
      },
      followers: {
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