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
      globalState: {
        type: Sequelize.STRING
      },
      privacySetting: {
        type: Sequelize.STRING
      },
      creator: {
        type: Sequelize.INTEGER
      },
      note: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      imagePath: {
        type: Sequelize.STRING
      },
      // totalComments: {
      //   type: Sequelize.INTEGER
      // },
      // totalLikes: {
      //   type: Sequelize.INTEGER
      // },
      // totalHearts: {
      //   type: Sequelize.INTEGER
      // },
      // totalRatings: {
      //   type: Sequelize.INTEGER
      // },
      // totalRatingScore: {
      //   type: Sequelize.INTEGER
      // },
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