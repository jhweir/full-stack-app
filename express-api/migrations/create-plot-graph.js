'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PlotGraphs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      numberOfPlotGraphAxes: {
        type: Sequelize.INTEGER
      },
      axis1Left: {
        type: Sequelize.STRING
      },
      axis1Right: {
        type: Sequelize.STRING
      },
      axis2Top: {
        type: Sequelize.STRING
      },
      axis2Bottom: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PlotGraphs');
  }
};