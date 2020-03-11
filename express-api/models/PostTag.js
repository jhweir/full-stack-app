'use strict';
module.exports = (sequelize, DataTypes) => {
  const PostTag = sequelize.define('PostTag', {
    postId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER
  }, {});
  PostTag.associate = function(models) {
    // associations can be defined here
  };
  return PostTag;
};