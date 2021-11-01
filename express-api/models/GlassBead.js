'use strict';
module.exports = (sequelize, DataTypes) => {
  const GlassBead = sequelize.define('GlassBead', {
    gameId: DataTypes.INTEGER,
    index: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    beadUrl: DataTypes.STRING,
    state: DataTypes.STRING,
  }, {});
  GlassBead.associate = function(models) {
    GlassBead.belongsTo(models.GlassBeadGame, {
        foreignKey: 'gameId',
    })
    GlassBead.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
    })
  };
  return GlassBead;
};