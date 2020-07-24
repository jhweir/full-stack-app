'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Comments', [
      {
        id: 1,
        creatorId: 1,
        postId: 4,
        text: 'Comment 1...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        creatorId: 2,
        postId: 4,
        text: 'Comment 2...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        creatorId: 1,
        postId: 4,
        text: 'Comment 3...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        creatorId: 2,
        postId: 4,
        text: 'Comment 4...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        creatorId: 3,
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
