module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.renameColumn('GlassBeadGames', 'turnDuration', 'moveDuration'),
            ]);
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.renameColumn('GlassBeadGames', 'moveDuration', 'turnDuration'),
            ]);
        });
    }
};