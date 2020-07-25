'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        id: 1,
        handle: 'user-1',
        name: 'User 1',
        bio: '...',
        flagImagePath: 'https://new-weco-user-flag-images.s3.eu-west-1.amazonaws.com/1595680990188',
        coverImagePath: null,
        facebookId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        handle: 'user-2',
        name: 'User 2',
        bio: '...',
        flagImagePath: 'https://new-weco-user-flag-images.s3.eu-west-1.amazonaws.com/1595681094988',
        coverImagePath: null,
        facebookId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        handle: 'user-3',
        name: 'User 3',
        bio: '...',
        flagImagePath: 'https://new-weco-user-flag-images.s3.eu-west-1.amazonaws.com/1595681053494',
        coverImagePath: null,
        facebookId: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        handle: 'user-4',
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
        handle: 'user-5',
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
        handle: 'user-6',
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
        handle: 'user-7',
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
