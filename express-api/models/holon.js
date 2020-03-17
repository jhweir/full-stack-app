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

    Holon.belongsToMany(models.Holon, { through: models.HolonHolon, as: 'Parent', foreignKey: 'holonAId' });
    //Holon.belongsToMany(models.Holon, { through: models.HolonHolon, as: 'Siblings', foreignKey: 'holonBId' });

    // Holon.hasMany(models.HolonHolon, {
    //   foreignKey: 'holonAId'
    // });
    // Holon.hasMany(models.HolonHolon, {
    //   foreignKey: 'holonBId'
    // });
    // Holon.belongsToMany(models.Holon, { 
    //   through: 'HolonHolon',
    //   foreignKey: 'holonAId'
    // });
  };
  return Holon;
};