'use strict';
module.exports = (sequelize, DataTypes) => {
  const HolonPost = sequelize.define('HolonPost', {
    holonId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER
  }, {});
  HolonPost.associate = function(models) {
    // associations can be defined here
  };
  return HolonPost;
};