'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('PlotGraphs', 'postId', {
            type: Sequelize.DataTypes.INTEGER
          }, { transaction: t })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('PlotGraphs', 'postId', { transaction: t }),
      ]);
    });
  }
};