'use strict';
module.exports = (sequelize, DataTypes) => {
  const VerticalBranchRelationship = sequelize.define('VerticalBranchRelationship', {
    parentBranchId: DataTypes.INTEGER,
    childBranchId: DataTypes.INTEGER
  }, {});
  VerticalBranchRelationship.associate = function(models) {
    VerticalBranchRelationship.belongsTo(models.Branch, {
      foreignKey: 'parentBranchId', 
      targetKey: 'id'
    })
  };
  return VerticalBranchRelationship;
};