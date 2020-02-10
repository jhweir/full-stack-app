const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database');

const Comments = db.define('Comment', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    post_id: {
        // Foreign key in Posts table
        type: Sequelize.INTEGER
    },
    user: {
        type: Sequelize.STRING
    },
    text: {
        type: Sequelize.STRING
    },
    reply_ids: {
        type: Sequelize.STRING
    },
    likes: {
        type: Sequelize.STRING
    },
    date: {
        type: Sequelize.DATE
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

module.exports = Comments;

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