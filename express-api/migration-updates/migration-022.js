module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn('Notifications', 'state', {
                    type: Sequelize.DataTypes.STRING
                }, { transaction: t }),
            ]);
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn('Notifications', 'state', { transaction: t }),
            ]);
        });
    }
};