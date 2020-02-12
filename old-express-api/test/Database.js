const Sequelize = require('sequelize');

require('dotenv').config()

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env

module.exports = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql'
});