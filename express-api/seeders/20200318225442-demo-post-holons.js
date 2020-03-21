'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PostHolons', [
      {
        postId: 1,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        postId: 2,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        postId: 2,
        holonId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        postId: 3,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        postId: 3,
        holonId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        postId: 3,
        holonId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        postId: 4,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        postId: 4,
        holonId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        postId: 4,
        holonId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        postId: 5,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        postId: 5,
        holonId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        postId: 5,
        holonId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('PostHolons', null, {});
  }
};
