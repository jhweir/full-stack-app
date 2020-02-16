'use strict';
module.exports = (sequelize, DataTypes) => {
  const Branch = sequelize.define('Branch', {
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    description: DataTypes.STRING,
    creator: DataTypes.STRING,
    mods: DataTypes.STRING,
    followers: DataTypes.STRING,
    tags: DataTypes.STRING,
    parent_branches: DataTypes.STRING,
    total_likes: DataTypes.INTEGER,
    total_comments: DataTypes.INTEGER
  }, {});
  Branch.associate = function(models) {
    Branch.belongsToMany(models.Post, { 
      through: 'Branch_Post',
      foreignKey: 'postId'
    });
  };
  return Branch;
};