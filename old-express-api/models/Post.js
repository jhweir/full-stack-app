
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('post', {
    title: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    creator: {
        type: DataTypes.STRING
    },
    tags: {
        type: DataTypes.STRING
    },
    comments: {
        type: DataTypes.STRING
    },
    likes: {
        type: DataTypes.INTEGER
    },
    pinned: {
        type: DataTypes.STRING
    }
  }, {})
  Post.associate = function(models) {
    // Post hasMany Comments
    Post.hasMany(models.Comment)
  }
  return Post
}