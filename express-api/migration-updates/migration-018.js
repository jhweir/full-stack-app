module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn('Comments', 'holonId', {
                    type: Sequelize.DataTypes.INTEGER
                }, { transaction: t })
            ]);
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn('Comments', 'holonId', { transaction: t })
            ]);
        });
    }
};
