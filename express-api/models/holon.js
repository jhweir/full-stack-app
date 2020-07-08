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
    })
    Holon.belongsToMany(models.Holon, {
      through: models.VerticalHolonRelationship,
      as: 'DirectChildHolons',
      foreignKey: 'holonAId'
    })
    // HolonTags relationship
    Holon.belongsToMany(models.Holon, {
      through: models.HolonHandle,
      as: 'A', // ?
      foreignKey: 'holonBId'
    })
    Holon.belongsToMany(models.Holon, {
      through: models.HolonHandle,
      as: 'HolonHandles',
      foreignKey: 'holonAId'
    })
    // HolonPosts relationship
    Holon.belongsToMany(models.Post, { 
      through: models.PostHolon,
      as: 'HolonPosts',
      foreignKey: 'holonId'
    })
    // HolonUsers relationship
    Holon.belongsToMany(models.User, { 
      through: models.HolonUser,
      as: 'HolonFollowers',
      foreignKey: 'holonId'
    })
  }
  return Holon;
}