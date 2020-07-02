'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Posts', [
      {
        id: 1,
        type: 'text',
        subType: null,
        globalState: 'visible',
        creatorId: 1,
        title: 'Post 1',
        description: 'Post 1 located in Root...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        type: 'text',
        subType: null,
        globalState: 'visible',
        creatorId: 1,
        title: 'Post 2',
        description: 'Post 2 located in All > Science...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        type: 'text',
        subType: null,
        globalState: 'visible',
        creatorId: 1,
        title: 'Post 3',
        description: 'Post 3 located in All > Science > Physics...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        type: 'text',
        subType: null,
        globalState: 'visible',
        creatorId: 1,
        title: 'Post 4',
        description: 'Post 4 located in All > Science > Biology...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        type: 'text',
        subType: null,
        globalState: 'visible',
        creatorId: 1,
        title: 'Post 5',
        description: 'Post 5 located in All > Science > Chemistry...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        type: 'poll',
        subType: 'single-choice',
        globalState: 'visible',
        creatorId: 2,
        title: 'Single Choice Poll',
        description: 'Choose one answer when you vote.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        type: 'poll',
        subType: 'multiple-choice',
        globalState: 'visible',
        creatorId: 2,
        title: 'Multiple Choice Poll',
        description: 'Choose multiple answers when you vote.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        type: 'poll',
        subType: 'weighted-choice',
        globalState: 'visible',
        creatorId: 2,
        title: 'Weighted Choice Poll',
        description: 'Spread 100 points across the answers in proportion to your support for each answer when you vote.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Posts', null, {})
  }
}
