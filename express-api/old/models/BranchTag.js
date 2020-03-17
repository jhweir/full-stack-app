'use strict';
module.exports = (sequelize, DataTypes) => {
  const BranchTag = sequelize.define('BranchTag', {
    branchId: DataTypes.INTEGER,
    branchName: DataTypes.STRING,
    tagId: DataTypes.INTEGER,
    tagName: DataTypes.STRING
  }, {});
  BranchTag.associate = function(models) {
    // BranchTag.belongsTo(models.Branch, {
    //   foreignKey: 'branchName'
    // })
    // BranchTag.belongsTo(models.Tag, {
    //   foreignKey: 'tagName'
    // })
  };
  return BranchTag;
};