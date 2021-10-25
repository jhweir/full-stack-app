module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn('GlassBeadGames', 'playerOrder', {
                    type: Sequelize.DataTypes.TEXT
                }, { transaction: t }),
                queryInterface.removeColumn('GlassBeadGames', 'numberOfPlayers', { transaction: t }),
            ]);
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn('GlassBeadGames', 'playerOrder', { transaction: t }),
                queryInterface.addColumn('GlassBeadGames', 'numberOfPlayers', {
                    type: Sequelize.DataTypes.INTEGER
                }, { transaction: t }),
            ]);
        });
    }
};