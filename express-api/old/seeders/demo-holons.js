'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Holons', [
            {
                id: 1,
                state: 'active',
                creatorId: 1,
                handle: 'all',
                name: 'All',
                description: 'This is the root holon...',
                flagImagePath: null,
                coverImagePath: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            //   {
            //     id: 2,
            //     handle: 'science',
            //     name: 'Science',
            //     description: 'Welcome to the Science holon...',
            //     flagImagePath: 'https://new-weco-holon-flag-images.s3.eu-west-1.amazonaws.com/1595681353083',
            //     coverImagePath: null,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            //   },
            //   {
            //     id: 3,
            //     handle: 'physics',
            //     name: 'Physics',
            //     description: 'Welcome to Physics',
            //     flagImagePath: 'https://new-weco-holon-flag-images.s3.eu-west-1.amazonaws.com/1595681388013',
            //     coverImagePath: null,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            //   },
            //   {
            //     id: 4,
            //     handle: 'biology',
            //     name: 'Biology',
            //     description: 'Welcome to Biology',
            //     flagImagePath: 'https://new-weco-holon-flag-images.s3.eu-west-1.amazonaws.com/1595681419303',
            //     coverImagePath: null,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            //   },
            //   {
            //     id: 5,
            //     handle: 'chemistry',
            //     name: 'Chemistry',
            //     description: 'Welcome to Chemistry',
            //     flagImagePath: 'https://new-weco-holon-flag-images.s3.eu-west-1.amazonaws.com/1595681449075',
            //     coverImagePath: null,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            //   },
            //   {
            //     id: 6,
            //     handle: 'qm',
            //     name: 'Quantum Mechanics',
            //     description: 'Welcome to Quantum Mechanics',
            //     flagImagePath: 'https://new-weco-holon-flag-images.s3.eu-west-1.amazonaws.com/1595681483358',
            //     coverImagePath: null,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            //   },
            //   {
            //     id: 7,
            //     handle: 'bristol',
            //     name: 'Bristol',
            //     description: 'The Bristol space',
            //     flagImagePath: 'https://new-weco-holon-flag-images.s3.eu-west-1.amazonaws.com/1595681510559',
            //     coverImagePath: null,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            //   },
            //   {
            //     id: 8,
            //     handle: 'art',
            //     name: 'Art',
            //     description: 'Art wooooo...',
            //     flagImagePath: 'https://new-weco-holon-flag-images.s3.eu-west-1.amazonaws.com/1595681536074',
            //     coverImagePath: null,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            //   },
            //   {
            //     id: 9,
            //     handle: 'gameb',
            //     name: 'Game-B',
            //     description: 'A space for all Game-B related discussion, sharing, decision making, and mapping',
            //     flagImagePath: 'https://new-weco-holon-flag-images.s3.eu-west-1.amazonaws.com/1595681571975',
            //     coverImagePath: null,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            //   },
            //   {
            //     id: 10,
            //     handle: 'gbprojects',
            //     name: 'Game-B Projects',
            //     description: 'A space for Game-B projects',
            //     flagImagePath: 'https://new-weco-holon-flag-images.s3.eu-west-1.amazonaws.com/1595681691378',
            //     coverImagePath: null,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            //   },
            //   {
            //     id: 11,
            //     handle: 'gbmapping',
            //     name: 'Game-B Mapping',
            //     description: 'A space for Game-B mapping',
            //     flagImagePath: 'https://new-weco-holon-flag-images.s3.eu-west-1.amazonaws.com/1595681627574',
            //     coverImagePath: null,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            //   }
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Holons', null, {});
    }
};
