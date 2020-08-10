'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    state: DataTypes.STRING,
    creatorId: DataTypes.INTEGER,
    parentCommentId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    text: DataTypes.STRING
  }, {});
  Comment.associate = function(models) {
    Comment.belongsTo(models.Post, {
      //as: 'postComment',
      foreignKey: 'postId',
      //sourceKey: 'postId'
    })
    Comment.belongsTo(models.User, {
      foreignKey: 'creatorId',
      as: 'commentCreator'
    })
  };
  return Comment;
};