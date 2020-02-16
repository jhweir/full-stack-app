'use strict';
module.exports = (sequelize, DataTypes) => {
  const Branch_Post = sequelize.define('Branch_Post', {
    branchId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER
  }, {});
  Branch_Post.associate = function(models) {
    // associations can be defined here
  };
  return Branch_Post;
};