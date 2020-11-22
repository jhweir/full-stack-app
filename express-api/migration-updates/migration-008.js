// change creator to 'creatorId'
// add description field
// change 'Reactions' to 'Reactions'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.renameColumn('Links', 'creator', 'creatorId'),
                queryInterface.addColumn('Links', 'description', {
                    type: Sequelize.DataTypes.INTEGER
                }, { transaction: t })
            ]);
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.renameColumn('Links', 'creatorId', 'creator'),
                queryInterface.removeColumn('Links', 'description', { transaction: t }),
            ]);
        });
    }
};