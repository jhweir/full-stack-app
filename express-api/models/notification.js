'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    ownerId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    text: DataTypes.TEXT,
    holonId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER
  }, {});
  Notification.associate = function(models) {
    //Notification.hasOne(models.User)
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'triggerUser'
    })
  };
  return Notification;
};