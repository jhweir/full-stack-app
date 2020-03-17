'use strict';
module.exports = (sequelize, DataTypes) => {
  const HolonHolon = sequelize.define('HolonHolon', {
    relationship: DataTypes.STRING,
    state: DataTypes.STRING,
    holonAId: DataTypes.INTEGER,
    holonBId: DataTypes.INTEGER
  }, {});
  HolonHolon.associate = function(models) {
    
    // HolonHolon.belongsTo(models.Holon, { as: 'Parent', onDelete: 'CASCADE'});
    // HolonHolon.belongsTo(models.Holon, { as: 'Sibling', onDelete: 'CASCADE' });

    HolonHolon.belongsTo(models.Holon, {
      // foreignKey: 'holonBId',
      // targetKey: 'id'
    })
    // HolonHolon.hasOne(models.Holon, {
    //   // foreignKey: {
    //   //   name: 'id'
    //   // }
    // });
  };
  return HolonHolon;
};