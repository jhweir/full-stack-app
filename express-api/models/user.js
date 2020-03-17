'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    handle: DataTypes.STRING,
    name: DataTypes.STRING,
    bio: DataTypes.STRING,
    profileImagePath: DataTypes.STRING,
    coverImagePath: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};