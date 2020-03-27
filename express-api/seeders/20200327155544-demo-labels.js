'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Labels', [
      {
        type: 'like',
        value: null,
        holonId: null,
        userId: null,
        postId: 1,
        commentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'like',
        value: null,
        holonId: null,
        userId: null,
        postId: 1,
        commentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'heart',
        value: null,
        holonId: null,
        userId: null,
        postId: 1,
        commentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'like',
        value: null,
        holonId: null,
        userId: null,
        postId: 2,
        commentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Labels', null, {});
  }
};
