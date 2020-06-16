'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Comments', [
      {
        id: 1,
        postId: 4,
        text: 'Comment 1...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        postId: 4,
        text: 'Comment 2...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        postId: 4,
        text: 'Comment 3...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        postId: 4,
        text: 'Comment 4...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
            {
        id: 5,
        postId: 4,
        text: 'Comment 5...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Comments', null, {})
  }
}
