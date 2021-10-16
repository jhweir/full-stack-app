'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [
            {
                id: 1,
                handle: 'admin',
                name: 'admin',
                email: 'admin@weco.io',
                password: '$2b$10$PaPDZc0ELfDGZMuGUSoZeO8nFYS/lDeg/8uM6HTJUgC6NzCFMYjXG',
                bio: '...',
                emailVerified: true,
                flagImagePath: null,
                coverImagePath: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ])
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {})
    }
}
