const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database');

const Posts = db.define('post', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    creator: {
        type: Sequelize.STRING
    },
    tags: {
        type: Sequelize.STRING
    },
    comments: {
        type: Sequelize.STRING
    },
    date: {
        type: Sequelize.DATE
    },
    likes: {
        type: Sequelize.INTEGER
    },
    pinned: {
        type: Sequelize.STRING
    }
    /*,
    createdAt: {
        type: Sequelize.DATE
    },
    updatedAt: {
        type: Sequelize.DATE
    },*/
},{
    timestamps: false
})

module.exports = Posts;

// Tutorial approach:
// 'use strict'
// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define(
//     'User', 
//     {
//       email: DataTypes.STRING,
//       password: DataTypes.STRING
//     },
//     {}
//   )
//   User.associate = function(models) {
//     // associations can be defined here
//   }
//   return User
// }

// Example approahc on https://sequelize.org/master/manual/model-basics.html
// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');

// const User = sequelize.define('User', {
//   // Model attributes are defined here
//   firstName: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   lastName: {
//     type: DataTypes.STRING
//     // allowNull defaults to true
//   }
// }, {
//   // Other model options go here
// });

// // `sequelize.define` also returns the model
// console.log(User === sequelize.models.User); // true