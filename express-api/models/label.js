'use strict';
module.exports = (sequelize, DataTypes) => {
  const Label = sequelize.define('Label', {
    type: DataTypes.STRING,
    value: DataTypes.STRING,
    state: DataTypes.STRING,
    holonId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER,
    pollAnswerId: DataTypes.INTEGER
  }, {});
  Label.associate = function(models) {
    Label.belongsTo(models.Post, {
      foreignKey: 'postId'
    })
    Label.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'creator'
    })
    Label.belongsTo(models.Holon, {
      foreignKey: 'holonId',
      as: 'space'
    })
    Label.belongsTo(models.PollAnswer, {
      foreignKey: 'pollAnswerId'
    })
  };
  return Label;
};