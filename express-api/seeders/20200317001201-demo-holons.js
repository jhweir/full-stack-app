'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Holons', [
      {
        handle: 'root',
        name: 'RootBranch',
        description: 'This is the root holon...',
        flagImagePath: null,
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        handle: 'science',
        name: 'Science',
        description: 'Welcome to the Science holon...',
        flagImagePath: null,
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        handle: 'physics',
        name: 'Physics',
        description: 'Welcome to Physics',
        flagImagePath: null,
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        handle: 'biology',
        name: 'Biology',
        description: 'Welcome to Biology',
        flagImagePath: null,
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        handle: 'chemistry',
        name: 'Chemistry',
        description: 'Welcome to Chemistry',
        flagImagePath: null,
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Holons', null, {});
  }
};
