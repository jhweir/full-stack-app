'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('GlassBeadGames', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            postId: {
                type: Sequelize.INTEGER
            },
            topic: {
                type: Sequelize.STRING
            },
            //   numberOfPlayers: {
            //     type: Sequelize.INTEGER
            //   },
            playerOrder: {
                type: Sequelize.TEXT
            },
            numberOfTurns: {
                type: Sequelize.INTEGER
            },
            moveDuration: {
                type: Sequelize.INTEGER
            },
            introDuration: {
                type: Sequelize.INTEGER
            },
            intervalDuration: {
                type: Sequelize.INTEGER
            },
            locked: {
                type: Sequelize.BOOLEAN
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('GlassBeadGames');
    }
};