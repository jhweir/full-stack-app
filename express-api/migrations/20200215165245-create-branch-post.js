'use strict';

// const Post = require('../models').Post
// const Branch = require('../models').Branch

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Branch_Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branchId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Branches',
          key: 'id'
        }
      },
      postId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Posts',
          key: 'id'
        }
      },
      // user: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: 'User',
      //     key: 'id'
      //   }
      // },
      // likes: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: 'Likes',
      //     key: 'id'
      //   }
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
    return queryInterface.dropTable('Branch_Posts');
  }
};