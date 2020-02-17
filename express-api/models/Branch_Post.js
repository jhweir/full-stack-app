'use strict';

// const Post = require('../models').Post
// const Branch = require('../models').Branch

module.exports = (sequelize, DataTypes) => {
  const Branch_Post = sequelize.define('Branch_Post', {
    branchId: {
      type: DataTypes.INTEGER,
      // references: {
      //   model: 'Branch',
      //   key: 'id'
      // }
    },
    postId: {
      type: DataTypes.INTEGER,
      // references: {
      //   model: 'Post',
      //   key: 'id'
      // }
    }
  }, {});
  Branch_Post.associate = function(models) {
    // associations can be defined here
  };
  return Branch_Post;
};