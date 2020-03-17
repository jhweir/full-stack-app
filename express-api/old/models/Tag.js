'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: DataTypes.STRING,
    creatorId: DataTypes.INTEGER
  }, {});
  Tag.associate = function(models) {
    Tag.belongsToMany(models.Branch, { 
      through: 'BranchTag',
      foreignKey: 'tagId'
    });
    Tag.belongsToMany(models.Post, { 
      through: 'PostTag',
      foreignKey: 'tagId'
    });
  };
  return Tag;
};