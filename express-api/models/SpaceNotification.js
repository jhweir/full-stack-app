'use strict';
module.exports = (sequelize, DataTypes) => {
  const SpaceNotification = sequelize.define('SpaceNotification', {
    ownerId: DataTypes.INTEGER,
    seen: DataTypes.BOOLEAN,
    type: DataTypes.STRING,
    state: DataTypes.STRING,
    holonAId: DataTypes.INTEGER,
    holonBId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER
  }, {});
  SpaceNotification.associate = function(models) {
    SpaceNotification.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'triggerUser'
    })
    SpaceNotification.belongsTo(models.Holon, {
        foreignKey: 'holonAId',
        as: 'triggerSpace'
    })
    SpaceNotification.belongsTo(models.Holon, {
        foreignKey: 'ownerId',
        as: 'owner'
    })
  };
  return SpaceNotification;
};