'use strict';
module.exports = (sequelize, DataTypes) => {
  const HolonUser = sequelize.define('HolonUser', {
    holonId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  HolonUser.associate = function(models) {
    // associations can be defined here
  };
  return HolonUser;
};