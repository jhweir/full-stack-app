'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('HolonUsers', [
            {
                id: 1,
                relationship: 'moderator',
                state: 'active',
                holonId: 1,
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('HolonUsers', null, {});
    }
};
