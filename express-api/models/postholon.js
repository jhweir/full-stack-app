'use strict'
module.exports = (sequelize, DataTypes) => {
  const PostHolon = sequelize.define('PostHolon', {
    type: DataTypes.STRING,
    relationship: DataTypes.STRING,
    creatorId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    holonId: DataTypes.INTEGER
  }, {})
  PostHolon.associate = function(models) {}
  return PostHolon;
};