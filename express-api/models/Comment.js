'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    creator: DataTypes.INTEGER,
    parentCommentId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    text: DataTypes.STRING
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
  };
  return Comment;
};