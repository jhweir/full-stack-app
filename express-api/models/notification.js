'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    type: DataTypes.STRING,
    text: DataTypes.STRING,
    holonId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER
  }, {});
  Notification.associate = function(models) {
    // associations can be defined here
  };
  return Notification;
};