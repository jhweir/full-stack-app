// change creator to 'creatorId'
// add description field
// change 'Reactions' to 'Reactions'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn('Links', 'description', { transaction: t }),
            ]);
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn('Links', 'description', {
                    type: Sequelize.DataTypes.STRING
                }, { transaction: t })
            ]);
        });
    }
};