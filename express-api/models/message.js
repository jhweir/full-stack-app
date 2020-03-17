'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    type: DataTypes.STRING,
    state: DataTypes.STRING,
    from: DataTypes.INTEGER,
    to: DataTypes.INTEGER,
    text: DataTypes.STRING
  }, {});
  Message.associate = function(models) {
    // associations can be defined here
  };
  return Message;
};