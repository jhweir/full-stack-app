'use strict';
module.exports = (sequelize, DataTypes) => {
  const Link = sequelize.define('Link', {
    state: DataTypes.STRING,
    creatorId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    relationship: DataTypes.STRING,
    description: DataTypes.TEXT,
    itemAId: DataTypes.INTEGER,
    itemBId: DataTypes.INTEGER
  }, {});
  Link.associate = function(models) {
    Link.belongsTo(models.User, {
      foreignKey: 'creatorId',
      as: 'creator'
    })
    Link.belongsTo(models.Post, {
      foreignKey: 'itemAId',
      as: 'postA'
    })
    Link.belongsTo(models.Post, {
      foreignKey: 'itemBId',
      as: 'postB'
    })
    // Link.belongsTo(models.Post, {
    //   //as: 'postComment',
    //   foreignKey: 'itemAId',
    //   //sourceKey: 'postId'
    // })
    // Link.belongsTo(models.User, {
    //   //foreignKey: 'creatorId',
    //   //as: 'commentCreator'
    // })
    // Link.belongsTo(models.Holon, {
    //   //foreignKey: 'creatorId',
    //   //as: 'commentCreator'
    // })
  };
  return Link;
};