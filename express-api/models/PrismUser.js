'use strict';
module.exports = (sequelize, DataTypes) => {
  const PrismUser = sequelize.define('PrismUser', {
    relationship: DataTypes.STRING,
    state: DataTypes.STRING,
    prismId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  PrismUser.associate = function(models) {
    // associations can be defined here
  };
  return PrismUser;
};