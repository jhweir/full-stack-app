'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    postType: DataTypes.STRING,
    globalState: DataTypes.STRING,
    privacySetting: DataTypes.STRING,
    creator: DataTypes.INTEGER,
    note: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    url: DataTypes.STRING,
    imagePath: DataTypes.STRING
  }, {});
  Post.associate = function(models) {
    Post.belongsToMany(models.Holon, { 
      through: models.PostHolon,
      foreignKey: 'postId'
    });
    Post.hasMany(models.Label);
    Post.hasMany(models.Comment);
  };
  return Post;
};