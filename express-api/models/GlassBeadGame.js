'use strict';
module.exports = (sequelize, DataTypes) => {
  const GlassBeadGame = sequelize.define('GlassBeadGame', {
    postId: DataTypes.INTEGER,
    topic: DataTypes.STRING,
    numberOfTurns: DataTypes.INTEGER,
    moveDuration: DataTypes.INTEGER,
    introDuration: DataTypes.INTEGER,
    intervalDuration: DataTypes.INTEGER,
    // numberOfPlayers: DataTypes.INTEGER,
    playerOrder: DataTypes.TEXT,
    locked: DataTypes.BOOLEAN
  }, {});
  GlassBeadGame.associate = function(models) {
    GlassBeadGame.hasMany(models.GlassBeadGameComment, {
        foreignKey: 'gameId',
    })
    GlassBeadGame.hasMany(models.GlassBead, {
        foreignKey: 'gameId',
    })
  };
  return GlassBeadGame;
};