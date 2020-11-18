'use strict';
module.exports = (sequelize, DataTypes) => {
  const PlotGraph = sequelize.define('PlotGraph', {
    numberOfPlotGraphAxes: DataTypes.INTEGER,
    axis1Left: DataTypes.STRING,
    axis1Right: DataTypes.STRING,
    axis2Top: DataTypes.STRING,
    axis2Bottom: DataTypes.STRING
  }, {});
  PlotGraph.associate = function(models) {
    PlotGraph.belongsTo(models.Post, {
      foreignKey: 'postId',
      as: 'creator'
    })
  };
  return PlotGraph;
};