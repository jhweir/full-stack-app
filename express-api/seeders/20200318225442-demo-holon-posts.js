'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Posts', [
      {
        holonId: 1,
        postId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        holonId: 1,
        postId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        holonId: 2,
        postId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        holonId: 1,
        postId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        holonId: 2,
        postId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        holonId: 3,
        postId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        holonId: 1,
        postId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        holonId: 2,
        postId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        holonId: 4,
        postId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        holonId: 1,
        postId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        holonId: 2,
        postId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        holonId: 5,
        postId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
