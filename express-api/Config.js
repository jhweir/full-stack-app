require('dotenv').config()
const devApi = process.env.NODE_ENV === 'dev'
const devApp = process.env.APP_ENV === 'dev'

module.exports = {
    username: process.env[devApi ? 'DEV_DB_USER' : 'PROD_DB_USER'],
    password: process.env[devApi ? 'DEV_DB_PASSWORD' : 'PROD_DB_PASSWORD'],
    database: process.env[devApi ? 'DEV_DB_NAME' : 'PROD_DB_NAME'],
    host: process.env[devApi ? 'DEV_DB_HOST' : 'PROD_DB_HOST'],
    dialect: 'mysql',

    appURL: process.env[devApp ? 'DEV_APP_URL' : 'PROD_APP_URL'],
    appURL2: devApp ? null : process.env.PROD_APP_URL2,
    apiUrl: process.env[devApi ? 'DEV_API_URL' : 'PROD_API_URL'],
}
