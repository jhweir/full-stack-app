'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('HolonHolons', [
      {
        relationship: 'A-direct-parent-of-B',
        state: 'open',
        holonAId: 1,
        holonBId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        relationship: 'A-direct-parent-of-B',
        state: 'open',
        holonAId: 2,
        holonBId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        relationship: 'A-direct-parent-of-B',
        state: 'open',
        holonAId: 2,
        holonBId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        relationship: 'A-direct-parent-of-B',
        state: 'open',
        holonAId: 2,
        holonBId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('HolonHolons', null, {});
  }
};
