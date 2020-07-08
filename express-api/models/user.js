'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    handle: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.STRING,
    profileImagePath: DataTypes.STRING,
    coverImagePath: DataTypes.STRING,
    facebookId: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Post, {
      foreignKey: 'creatorId',
      //as: 'createdPosts'
    })
    User.hasMany(models.Comment, {
      foreignKey: 'creatorId',
      //as: 'createdComments'
    })
    // HolonPosts relationship
    User.belongsToMany(models.Holon, { 
      through: models.HolonUser,
      as: 'FollowedHolons',
      foreignKey: 'userId'
    })
  };
  return User;
};