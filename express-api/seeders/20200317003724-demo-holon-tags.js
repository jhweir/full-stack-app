'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('HolonTags', [
      {
        state: 'open',
        holonAId: 1,
        holonBId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 2,
        holonBId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 2,
        holonBId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 3,
        holonBId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 3,
        holonBId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 3,
        holonBId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 4,
        holonBId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 4,
        holonBId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 4,
        holonBId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 5,
        holonBId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 5,
        holonBId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 5,
        holonBId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 6,
        holonBId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 6,
        holonBId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 6,
        holonBId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 6,
        holonBId: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('HolonTags', null, {});
  }
};
