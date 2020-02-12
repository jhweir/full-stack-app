
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    post_id: {
      // Foreign key in Posts table
      type: DataTypes.INTEGER
    },
    user: {
      type: DataTypes.STRING
    },
    text: {
      type: DataTypes.STRING
    },
    reply_ids: {
      type: DataTypes.STRING
    },
    likes: {
      type: DataTypes.STRING
    }
  }, {})
  Comment.associate = function(models) {
    // Comment belongsTo Post
    Comment.belongsTo(models.Post, {foreignKey: 'post_id'})
  }
  return Comment
}