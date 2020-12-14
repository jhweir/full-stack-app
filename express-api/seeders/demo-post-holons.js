'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PostHolons', [
      {
        type: 'post',
        relationship: 'direct',
        postId: 1,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'post',
        relationship: 'indirect',
        postId: 2,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'post',
        relationship: 'direct',
        postId: 2,
        holonId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'post',
        relationship: 'indirect',
        postId: 3,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'post',
        relationship: 'indirect',
        postId: 3,
        holonId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'post',
        relationship: 'direct',
        postId: 3,
        holonId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'post',
        relationship: 'indirect',
        postId: 4,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'post',
        relationship: 'indirect',
        postId: 4,
        holonId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'post',
        relationship: 'direct',
        postId: 4,
        holonId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'post',
        relationship: 'indirect',
        postId: 5,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'post',
        relationship: 'indirect',
        postId: 5,
        holonId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'post',
        relationship: 'direct',
        postId: 5,
        holonId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'post',
        relationship: 'direct',
        postId: 6,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'post',
        relationship: 'direct',
        postId: 7,
        holonId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'post',
        relationship: 'direct',
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
