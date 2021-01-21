module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.renameColumn('Notifications', 'holonId', 'holonAId'),
                queryInterface.addColumn('Notifications', 'holonBId', {
                    type: Sequelize.DataTypes.INTEGER
                }, { transaction: t })
            ]);
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.renameColumn('Notifications', 'holonAId', 'holonId'),
                queryInterface.removeColumn('Notifications', 'holonBId', { transaction: t }),
            ]);
        });
    }
};