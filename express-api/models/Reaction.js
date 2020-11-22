'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reaction = sequelize.define('Reaction', {
    type: DataTypes.STRING,
    value: DataTypes.STRING,
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
      as: 'creator'
    })
    Reaction.belongsTo(models.Holon, {
      foreignKey: 'holonId',
      as: 'space'
    })
    Reaction.belongsTo(models.PollAnswer, {
      foreignKey: 'pollAnswerId'
    })
  };
  return Reaction;
};