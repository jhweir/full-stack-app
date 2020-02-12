'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    user: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    tags: DataTypes.STRING,
    comments: DataTypes.STRING,
    pins: DataTypes.STRING,
    likes: DataTypes.INTEGER
  }, {});
  Post.associate = function(models) {
    // Newpost hasMany Comments
    Post.hasMany(models.Comment);
  };
  return Post;
};