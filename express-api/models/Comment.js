'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    postId: DataTypes.INTEGER,
    user: DataTypes.STRING,
    text: DataTypes.STRING,
    replies: DataTypes.STRING,
    pinned: DataTypes.STRING,
    likes: DataTypes.INTEGER
  }, {});
  Comment.associate = function(models) {
    // Comment belongsTo Post
    Comment.belongsTo(models.Post);
  };
  return Comment;
};