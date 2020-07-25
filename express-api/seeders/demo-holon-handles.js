'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('HolonHandles', [ 
      // Posts to holon A appear within holon B
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
      {
        state: 'open',
        holonAId: 7,
        holonBId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 7,
        holonBId: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 8,
        holonBId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 8,
        holonBId: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 9,
        holonBId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 9,
        holonBId: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 10,
        holonBId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 10,
        holonBId: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 10,
        holonBId: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 11,
        holonBId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 11,
        holonBId: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 'open',
        holonAId: 11,
        holonBId: 11,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('HolonHandles', null, {});
  }
};
