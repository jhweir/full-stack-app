'use strict';
module.exports = (sequelize, DataTypes) => {
  const GlassBeadGame = sequelize.define('GlassBeadGame', {
    postId: DataTypes.INTEGER,
    topic: DataTypes.STRING,
    numberOfTurns: DataTypes.INTEGER,
    turnDuration: DataTypes.INTEGER,
    introDuration: DataTypes.INTEGER,
    intervalDuration: DataTypes.INTEGER,
    numberOfPlayers: DataTypes.INTEGER,
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