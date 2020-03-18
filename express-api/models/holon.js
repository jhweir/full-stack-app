'use strict';
module.exports = (sequelize, DataTypes) => {
  const Holon = sequelize.define('Holon', {
    handle: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    flagImagePath: DataTypes.STRING,
    coverImagePath: DataTypes.STRING
  }, {});
  Holon.associate = function(models) {
    Holon.belongsToMany(models.Holon, {
      through: models.HolonHolon,
      as: 'parent',
      foreignKey: 'holonBId'
    });
    Holon.belongsToMany(models.Holon, {
      through: models.HolonHolon,
      as: 'child',
      foreignKey: 'holonAId'
    });
  };
  return Holon;
};