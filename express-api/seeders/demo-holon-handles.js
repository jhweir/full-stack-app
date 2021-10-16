'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('HolonHandles', [ 
            // Posts to holon A appear within holon B
            {
                id: 1,
                state: 'open',
                holonAId: 1,
                holonBId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('HolonHandles', null, {});
    }
};
