module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.renameColumn('GlassBeadGames', 'saved', 'locked'),
                queryInterface.addColumn('GlassBeadGames', 'numberOfPlayers', {
                    type: Sequelize.DataTypes.INTEGER
                }, { transaction: t }),
                queryInterface.addColumn('GlassBeads', 'state', {
                    type: Sequelize.DataTypes.STRING
                }, { transaction: t }),
                queryInterface.removeColumn('GlassBeadGameComments', 'index', { transaction: t }),
            ]);
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.renameColumn('GlassBeadGames', 'locked', 'saved'),
                queryInterface.removeColumn('GlassBeadGames', 'numberOfPlayers', { transaction: t }),
                queryInterface.removeColumn('GlassBeads', 'state', { transaction: t }),
                queryInterface.addColumn('GlassBeadGameComments', 'index', {
                    type: Sequelize.DataTypes.INTEGER
                }, { transaction: t }),
            ]);
        });
    }
};