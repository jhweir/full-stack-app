'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Posts', [
      {
        globalState: 'visible',
        title: 'Post 1',
        description: 'Post 1 located in Root...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        globalState: 'visible',
        title: 'Post 2',
        description: 'Post 2 located in All > Science...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        globalState: 'visible',
        title: 'Post 3',
        description: 'Post 3 located in All > Science > Physics...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        globalState: 'visible',
        title: 'Post 4',
        description: 'Post 4 located in All > Science > Biology...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        globalState: 'visible',
        title: 'Post 5',
        description: 'Post 5 located in All > Science > Chemistry...',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Posts', null, {});
  }
};
