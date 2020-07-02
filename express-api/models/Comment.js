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
      //as: 'postComment',
      foreignKey: 'postId',
      //sourceKey: 'postId'
    })
    // Comment.hasOne(models.User, {
    //   //as: 'commentCreator'
    // })
  };
  return Comment;
};