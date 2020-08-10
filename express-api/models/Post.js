'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    type: DataTypes.STRING,
    subType: DataTypes.STRING,
    state: DataTypes.STRING,
    creatorId: DataTypes.INTEGER,
    text: DataTypes.STRING,
    url: DataTypes.STRING,
    imagePath: DataTypes.STRING
  }, {})
  Post.associate = function(models) {
    // why not 'belongsTo' like Comment.belongsTo(models.Post, ?
    Post.belongsTo(models.User, {
      foreignKey: 'creatorId',
      as: 'creator'
    })
    Post.belongsToMany(models.Holon, { 
      through: models.PostHolon,
      as: 'PostHolons',
      foreignKey: 'postId'
    })
    Post.hasMany(models.Label)
    // Post.hasMany(models.Label, {
    //   as: 'PollVotes'
    // })
    Post.hasMany(models.Comment, {
      foreignKey: 'postId'
    })
    Post.hasMany(models.PollAnswer)
  }
  return Post
}