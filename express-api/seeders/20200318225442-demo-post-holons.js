'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PostHolons', [
      {
        localState: 'visible',
        relationship: 'post',
        postId: 1,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        localState: 'visible',
        relationship: 'post',
        postId: 2,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        localState: 'visible',
        relationship: 'post',
        postId: 2,
        holonId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        localState: 'visible',
        relationship: 'post',
        postId: 3,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        localState: 'visible',
        relationship: 'post',
        postId: 3,
        holonId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        localState: 'visible',
        relationship: 'post',
        postId: 3,
        holonId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        localState: 'visible',
        relationship: 'post',
        postId: 4,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        localState: 'visible',
        relationship: 'post',
        postId: 4,
        holonId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        localState: 'visible',
        relationship: 'post',
        postId: 4,
        holonId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        localState: 'visible',
        relationship: 'post',
        postId: 5,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        localState: 'visible',
        relationship: 'post',
        postId: 5,
        holonId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        localState: 'visible',
        relationship: 'post',
        postId: 5,
        holonId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        localState: 'visible',
        relationship: 'post',
        postId: 6,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        localState: 'visible',
        relationship: 'post',
        postId: 7,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        localState: 'visible',
        relationship: 'post',
        postId: 8,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('PostHolons', null, {});
  }
};
