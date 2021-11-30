'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reaction = sequelize.define('Reaction', {
    type: DataTypes.STRING,
    value: DataTypes.STRING, // update to number
    state: DataTypes.STRING,
    holonId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER,
    pollAnswerId: DataTypes.INTEGER,
    linkId: DataTypes.INTEGER
  }, {});
  Reaction.associate = function(models) {
    Reaction.belongsTo(models.Post, {
      foreignKey: 'postId'
    })
    Reaction.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'Creator'
    })
    Reaction.belongsTo(models.Holon, {
      foreignKey: 'holonId',
      as: 'Space'
    })
    Reaction.belongsTo(models.PollAnswer, {
      foreignKey: 'pollAnswerId'
    })
  };
  return Reaction;
};