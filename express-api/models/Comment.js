'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    creator: DataTypes.INTEGER,
    parentCommentId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    text: DataTypes.STRING
  }, {});
  Comment.associate = function(models) {
    Comment.belongsTo(models.Post, {
      foreignKey: 'postId'
    })
  };
  return Comment;
};