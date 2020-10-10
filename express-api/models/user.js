'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    handle: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.TEXT,
    flagImagePath: DataTypes.TEXT,
    coverImagePath: DataTypes.TEXT,
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
    User.hasMany(models.Label)
    User.belongsToMany(models.Holon, { 
      through: models.HolonUser,
      as: 'FollowedHolons',
      foreignKey: 'userId'
    })
    User.belongsToMany(models.Holon, { 
      through: models.HolonUser,
      as: 'ModeratedHolons',
      foreignKey: 'userId'
    })
    User.belongsToMany(models.Prism, { 
      through: models.PrismUser,
      //as: 'ModeratedHolons',
      foreignKey: 'userId'
    })
  };
  return User;
};