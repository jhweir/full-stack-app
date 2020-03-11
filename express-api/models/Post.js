'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    creator: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    comments: DataTypes.STRING,
    pins: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    visible: DataTypes.BOOLEAN
  }, {});
  Post.associate = function(models) {
    Post.hasMany(models.Comment);
    // Post.belongsToMany(models.Branch, { 
    //   through: 'Branch_Post',
    //   foreignKey: 'postId'
    // });
    Post.belongsToMany(models.Tag, { 
      through: 'PostTag',
      foreignKey: 'postId'
    });
  };
  return Post;
};