'use strict';
module.exports = (sequelize, DataTypes) => {
  const Branch = sequelize.define('Branch', {
    creator: DataTypes.STRING,
    name: DataTypes.STRING,
    handle: DataTypes.STRING,
    flag_image: DataTypes.STRING,
    cover_image: DataTypes.STRING,
    description: DataTypes.STRING,
    mods: DataTypes.STRING,
    followers: DataTypes.STRING,
    parent_branches: DataTypes.STRING,
    total_likes: DataTypes.INTEGER,
    total_comments: DataTypes.INTEGER
  }, {});
  Branch.associate = function(models) {
    // Branch.belongsToMany(models.Post, { 
    //   through: 'Branch_Post',
    //   foreignKey: 'branchId'
    // });
    Branch.belongsToMany(models.Tag, { 
      through: 'BranchTag',
      foreignKey: 'branchId'
    });
    Branch.hasMany(models.VerticalBranchRelationship);
  };
  return Branch;
};