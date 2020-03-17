'use strict';
module.exports = (sequelize, DataTypes) => {
  const Holon = sequelize.define('Holon', {
    handle: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    flagImagePath: DataTypes.STRING,
    coverImagePath: DataTypes.STRING
  }, {});
  Holon.associate = function(models) {
    // associations can be defined here
  };
  return Holon;
};