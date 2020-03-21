'use strict';
module.exports = (sequelize, DataTypes) => {
  const HolonHolon = sequelize.define('HolonTag', {
    state: DataTypes.STRING,
    holonAId: DataTypes.INTEGER,
    holonBId: DataTypes.INTEGER
  }, {});
  HolonHolon.associate = function(models) {};
  return HolonHolon;
};