'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    state: DataTypes.STRING,
    creatorId: DataTypes.INTEGER,
    holonId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    parentCommentId: DataTypes.INTEGER,
    text: DataTypes.TEXT
  }, {});
  Comment.associate = function(models) {
    Comment.belongsTo(models.Post, {
      //as: 'postComment',
      foreignKey: 'postId',
      //sourceKey: 'postId'
    })
    Comment.belongsTo(models.User, {
      foreignKey: 'creatorId',
      as: 'Creator'
    })
    Comment.hasMany(models.Comment, {
      foreignKey: 'parentCommentId',
      as: 'Replies'
    })
  };
  return Comment;
};