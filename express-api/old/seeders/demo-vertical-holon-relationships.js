'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('VerticalHolonRelationships', [
            // // Holon A is a direct parent of holon B
            // {
            //     state: 'open',
            //     holonAId: 1,
            //     holonBId: 2,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     state: 'open',
            //     holonAId: 2,
            //     holonBId: 3,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     state: 'open',
            //     holonAId: 2,
            //     holonBId: 4,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     state: 'open',
            //     holonAId: 2,
            //     holonBId: 5,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     state: 'open',
            //     holonAId: 3,
            //     holonBId: 6,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     state: 'open',
            //     holonAId: 1,
            //     holonBId: 7,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     state: 'open',
            //     holonAId: 1,
            //     holonBId: 8,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     state: 'open',
            //     holonAId: 1,
            //     holonBId: 9,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     state: 'open',
            //     holonAId: 9,
            //     holonBId: 10,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     state: 'open',
            //     holonAId: 9,
            //     holonBId: 11,
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('VerticalHolonRelationships', null, {});
    }
};
