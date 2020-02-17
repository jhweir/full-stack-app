'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    user: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    tags: DataTypes.STRING,
    comments: DataTypes.STRING,
    pins: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    // branches: DataTypes.STRING,
    visible: DataTypes.BOOLEAN
  }, {});
  Post.associate = function(models) {
    Post.hasMany(models.Comment);
    Post.belongsToMany(models.Branch, { 
      through: 'Branch_Post',
      foreignKey: 'postId'
    });
  };
  return Post;
};