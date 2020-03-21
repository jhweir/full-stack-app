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
    // VHR relationship
    Holon.belongsToMany(models.Holon, {
      through: models.VerticalHolonRelationship,
      as: 'DirectParentHolons',
      foreignKey: 'holonBId'
    });
    Holon.belongsToMany(models.Holon, {
      through: models.VerticalHolonRelationship,
      as: 'DirectChildHolons',
      foreignKey: 'holonAId'
    });

    // HolonTag relationship
    Holon.belongsToMany(models.Holon, {
      through: models.HolonTag,
      as: 'A',
      foreignKey: 'holonBId'
    });
    Holon.belongsToMany(models.Holon, {
      through: models.HolonTag,
      as: 'TagOwner',
      foreignKey: 'holonAId'
    });

    // HolonPost relationship
    Holon.belongsToMany(models.Post, { 
      through: models.PostHolon,
      foreignKey: 'holonId'
    });
  };
  return Holon;
};