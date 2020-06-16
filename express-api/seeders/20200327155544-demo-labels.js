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
        pollAnswerId: null,
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
        pollAnswerId: null,
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
        pollAnswerId: null,
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
        pollAnswerId: null,
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
        pollAnswerId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'heart',
        value: null,
        holonId: null,
        userId: null,
        postId: 5,
        commentId: null,
        pollAnswerId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'heart',
        value: null,
        holonId: null,
        userId: null,
        postId: 5,
        commentId: null,
        pollAnswerId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'heart',
        value: null,
        holonId: null,
        userId: null,
        postId: 5,
        commentId: null,
        pollAnswerId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'vote',
        value: 1,
        holonId: null,
        userId: null,
        postId: 6,
        commentId: null,
        pollAnswerId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'vote',
        value: 1,
        holonId: null,
        userId: null,
        postId: 6,
        commentId: null,
        pollAnswerId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'vote',
        value: 1,
        holonId: null,
        userId: null,
        postId: 6,
        commentId: null,
        pollAnswerId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Labels', null, {});
  }
};
