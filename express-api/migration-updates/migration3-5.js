'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.renameColumn('PostHolons', 'localState', 'type'),
        queryInterface.renameColumn('PostHolons', 'creator', 'creatorId'),
        queryInterface.addColumn('Holons', 'creatorId', {
            type: Sequelize.DataTypes.INTEGER
          }, { transaction: t })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.renameColumn('PostHolons', 'type', 'localState'),
        queryInterface.renameColumn('PostHolons', 'creatorId', 'creator'),
        queryInterface.removeColumn('Holons', 'creatorId', { transaction: t }),
      ]);
    });
  }
};