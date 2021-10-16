'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
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
  Notification.associate = function(models) {
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'triggerUser'
    })
    Notification.belongsTo(models.Holon, {
      foreignKey: 'holonAId',
      as: 'triggerSpace'
    })
    Notification.belongsTo(models.Holon, {
        foreignKey: 'holonBId',
        as: 'secondarySpace'
    })
  };
  return Notification;
};