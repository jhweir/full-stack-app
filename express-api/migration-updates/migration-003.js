'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('PostHolons', 'localState', { transaction: t }),
        queryInterface.addColumn('PostHolons', 'type', {
          type: Sequelize.DataTypes.TEXT
        }, { transaction: t })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('PostHolons', 'localState', {
          type: Sequelize.DataTypes.TEXT
        }, { transaction: t }),
        queryInterface.removeColumn('PostHolons', 'type', { transaction: t }),
      ]);
    });
  }
};
