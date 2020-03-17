'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserUser = sequelize.define('UserUser', {
    relationship: DataTypes.STRING,
    userAId: DataTypes.INTEGER,
    userBId: DataTypes.INTEGER
  }, {});
  UserUser.associate = function(models) {
    // associations can be defined here
  };
  return UserUser;
};