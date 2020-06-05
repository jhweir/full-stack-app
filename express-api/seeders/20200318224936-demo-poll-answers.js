'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PollAnswers', [
      {
        text: 'Answer 1...',
        postId: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Answer 2...',
        postId: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Answer 3...',
        postId: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: 'Answer 4...',
        postId: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('PollAnswers', null, {})
  }
}
