'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Posts', [
            // {
            //     id: 1,
            //     type: 'text',
            //     subType: null,
            //     state: 'visible',
            //     creatorId: 1,
            //     text: 'Post 1 located in Root...',
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     id: 2,
            //     type: 'text',
            //     subType: null,
            //     state: 'visible',
            //     creatorId: 1,
            //     text: 'Post 2 located in All > Science...',
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     id: 3,
            //     type: 'text',
            //     subType: null,
            //     state: 'visible',
            //     creatorId: 1,
            //     text: 'Post 3 located in All > Science > Physics...',
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     id: 4,
            //     type: 'text',
            //     subType: null,
            //     state: 'visible',
            //     creatorId: 1,
            //     text: 'Post 4 located in All > Science > Biology...',
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     id: 5,
            //     type: 'text',
            //     subType: null,
            //     state: 'visible',
            //     creatorId: 1,
            //     text: 'Post 5 located in All > Science > Chemistry...',
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     id: 6,
            //     type: 'poll',
            //     subType: 'single-choice',
            //     state: 'visible',
            //     creatorId: 2,
            //     text: 'Single Choice Poll: Choose one answer when you vote.',
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     id: 7,
            //     type: 'poll',
            //     subType: 'multiple-choice',
            //     state: 'visible',
            //     creatorId: 2,
            //     text: 'Multiple Choice Poll: Choose multiple answers when you vote.',
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
            // {
            //     id: 8,
            //     type: 'poll',
            //     subType: 'weighted-choice',
            //     state: 'visible',
            //     creatorId: 2,
            //     text: 'Weighted Choice Poll: Spread 100 points across the answers in proportion to your support for each answer when you vote.',
            //     createdAt: new Date(),
            //     updatedAt: new Date()
            // },
        ])
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Posts', null, {})
    }
}
