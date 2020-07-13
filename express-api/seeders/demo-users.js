'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        id: 1,
        handle: null,
        name: 'User 1',
        bio: '...',
        flagImagePath: null,
        coverImagePath: null,
        facebookId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        handle: null,
        name: 'User 2',
        bio: '...',
        flagImagePath: null,
        coverImagePath: null,
        facebookId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        handle: null,
        name: 'User 3',
        bio: '...',
        flagImagePath: null,
        coverImagePath: null,
        facebookId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        handle: null,
        name: 'User 4',
        bio: '...',
        flagImagePath: null,
        coverImagePath: null,
        facebookId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        handle: null,
        name: 'User 5',
        bio: '...',
        flagImagePath: null,
        coverImagePath: null,
        facebookId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        handle: null,
        name: 'User 6',
        bio: '...',
        flagImagePath: null,
        coverImagePath: null,
        facebookId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        handle: null,
        name: 'User 7',
        bio: '...',
        flagImagePath: null,
        coverImagePath: null,
        facebookId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}
