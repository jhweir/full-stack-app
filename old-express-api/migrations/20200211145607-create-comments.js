'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    // Run "npx sequelize db:migrate" to create table
    return queryInterface.createTable('comments', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      post_id: {
        // Foreign key in Posts table
        type: Sequelize.INTEGER
      },
      user: {
        type: Sequelize.STRING
      },
      text: {
        type: Sequelize.STRING
      },
      reply_ids: {
        type: Sequelize.STRING
      },
      likes: {
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
    // Run "npx sequelize db:migrate:undo" to drop table
    return queryInterface.dropTable('comments')
  }
};
