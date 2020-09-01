'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    type: DataTypes.STRING,
    subType: DataTypes.STRING,
    state: DataTypes.STRING,
    creatorId: DataTypes.INTEGER,
    text: DataTypes.TEXT,
    url: DataTypes.TEXT,
    urlImage: DataTypes.TEXT,
    urlDomain: DataTypes.TEXT,
    urlTitle: DataTypes.TEXT,
    urlDescription: DataTypes.TEXT
  }, {})
  Post.associate = function(models) {
    // why not 'belongsTo' like Comment.belongsTo(models.Post, ?
    Post.belongsTo(models.User, {
      foreignKey: 'creatorId',
      as: 'creator'
    })
    Post.belongsToMany(models.Holon, { 
      through: models.PostHolon,
      as: 'DirectSpaces',
      foreignKey: 'postId'
    })
    Post.belongsToMany(models.Holon, { 
      through: models.PostHolon,
      as: 'IndirectSpaces',
      foreignKey: 'postId'
    })
    Post.belongsToMany(models.Holon, { 
      through: models.PostHolon,
      as: 'Reposts',
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