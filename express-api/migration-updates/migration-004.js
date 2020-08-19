'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('PostHolons', 'creator', { transaction: t }),
        queryInterface.addColumn('PostHolons', 'creatorId', {
          type: Sequelize.DataTypes.TEXT
        }, { transaction: t })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('PostHolons', 'creator', {
          type: Sequelize.DataTypes.TEXT
        }, { transaction: t }),
        queryInterface.removeColumn('PostHolons', 'creatorId', { transaction: t }),
      ]);
    });
  }
};
