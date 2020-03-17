'use strict';
module.exports = (sequelize, DataTypes) => {
  const Label = sequelize.define('Label', {
    type: DataTypes.STRING,
    value: DataTypes.STRING,
    holonId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER
  }, {});
  Label.associate = function(models) {
    // associations can be defined here
  };
  return Label;
};