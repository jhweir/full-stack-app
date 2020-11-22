'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Reactions', [
      {
        type: 'like',
        value: null,
        state: 'active',
        holonId: 1,
        userId: 1,
        postId: 1,
        commentId: null,
        pollAnswerId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'like',
        value: null,
        state: 'active',
        holonId: 1,
        userId: 2,
        postId: 1,
        commentId: null,
        pollAnswerId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'like',
        value: null,
        state: 'active',
        holonId: 1,
        userId: 3,
        postId: 1,
        commentId: null,
        pollAnswerId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'heart',
        value: null,
        state: 'active',
        holonId: 1,
        userId: 1,
        postId: 1,
        commentId: null,
        pollAnswerId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'like',
        value: null,
        state: 'active',
        holonId: 1,
        userId: 1,
        postId: 2,
        commentId: null,
        pollAnswerId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'heart',
        value: null,
        state: 'active',
        holonId: 1,
        userId: 1,
        postId: 5,
        commentId: null,
        pollAnswerId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'heart',
        value: null,
        state: 'active',
        holonId: 1,
        userId: 2,
        postId: 5,
        commentId: null,
        pollAnswerId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'heart',
        value: null,
        state: 'active',
        holonId: 1,
        userId: 3,
        postId: 5,
        commentId: null,
        pollAnswerId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'vote',
        value: 1,
        state: 'active',
        holonId: 1,
        userId: 1,
        postId: 6,
        commentId: null,
        pollAnswerId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'vote',
        value: 1,
        state: 'active',
        holonId: 1,
        userId: 2,
        postId: 6,
        commentId: null,
        pollAnswerId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'vote',
        value: 1,
        state: 'active',
        holonId: 1,
        userId: 3,
        postId: 6,
        commentId: null,
        pollAnswerId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Reactions', null, {});
  }
};
