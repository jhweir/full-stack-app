'use strict';
module.exports = (sequelize, DataTypes) => {
  const Link = sequelize.define('Link', {
    creatorId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    relationship: DataTypes.STRING,
    description: DataTypes.TEXT,
    itemAId: DataTypes.INTEGER,
    itemBId: DataTypes.INTEGER
  }, {});
  Link.associate = function(models) {
    // associations can be defined here
  };
  return Link;
};