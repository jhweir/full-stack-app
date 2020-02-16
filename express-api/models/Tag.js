'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: DataTypes.STRING
  }, {});
  Tag.associate = function(models) {
    Tag.belongsToMany(models.Post, { 
      through: 'Post_Tags',
      foreignKey: 'PostId'
    });
  };
  return Tag;
};