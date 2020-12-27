module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn('Users', 'emailVerified', {
                    type: Sequelize.DataTypes.BOOLEAN
                }, { transaction: t }),
                queryInterface.addColumn('Users', 'emailToken', {
                    type: Sequelize.DataTypes.TEXT
                }, { transaction: t })
            ]);
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn('Users', 'emailVerified', { transaction: t }),
                queryInterface.removeColumn('Users', 'emailToken', { transaction: t }),
            ]);
        });
    }
};
