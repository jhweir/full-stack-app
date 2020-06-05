'use strict'
module.exports = (sequelize, DataTypes) => {
  const PostHolon = sequelize.define('PostHolon', {
    creator: DataTypes.STRING,
    relationship: DataTypes.STRING,
    localState: DataTypes.STRING,
    postId: DataTypes.INTEGER,
    holonId: DataTypes.INTEGER
  }, {})
  PostHolon.associate = function(models) {}
  return PostHolon;
};