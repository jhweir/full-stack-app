'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('posts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      title: {
          type: Sequelize.STRING
      },
      description: {
          type: Sequelize.STRING
      },
      creator: {
          type: Sequelize.STRING
      },
      tags: {
          type: Sequelize.STRING
      },
      comments: {
          type: Sequelize.STRING
      },
      likes: {
          type: Sequelize.INTEGER
      },
      pinned: {
          type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('posts')
  }
}