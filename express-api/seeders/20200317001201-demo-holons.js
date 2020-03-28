'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Holons', [
      { // id: 1
        handle: 'root',
        name: 'All',
        description: 'This is the root holon...',
        flagImagePath: null,
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // id: 2
        handle: 'science',
        name: 'Science',
        description: 'Welcome to the Science holon...',
        flagImagePath: null,
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // id: 3
        handle: 'physics',
        name: 'Physics',
        description: 'Welcome to Physics',
        flagImagePath: null,
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // id: 4
        handle: 'biology',
        name: 'Biology',
        description: 'Welcome to Biology',
        flagImagePath: null,
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // id: 5
        handle: 'chemistry',
        name: 'Chemistry',
        description: 'Welcome to Chemistry',
        flagImagePath: null,
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // id: 6
        handle: 'qm',
        name: 'Quantum Mechanics',
        description: 'Welcome to Quantum Mechanics',
        flagImagePath: null,
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // id: 7
        handle: 'bristol',
        name: 'Bristol',
        description: 'The Bristol space',
        flagImagePath: null,
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // id: 8
        handle: 'art',
        name: 'Art',
        description: 'Art wooooo...',
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
