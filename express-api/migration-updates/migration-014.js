module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn('Users', 'passwordResetToken', {
                    type: Sequelize.DataTypes.TEXT
                }, { transaction: t }),
                queryInterface.addColumn('Users', 'accountVerified', {
                    type: Sequelize.DataTypes.BOOLEAN
                }, { transaction: t })
            ]);
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn('Users', 'passwordResetToken', { transaction: t }),
                queryInterface.removeColumn('Users', 'accountVerified', { transaction: t }),
            ]);
        });
    }
};
