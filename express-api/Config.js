require('dotenv').config()
const devApi = process.env.NODE_ENV === 'dev'
const devApp = process.env.APP_ENV === 'dev'

module.exports = {
    dbUser: devApi ? process.env.DEV_DB_USER : process.env.PROD_DB_USER,
    dbPassword: devApi ? process.env.DEV_DB_PASSWORD : process.env.PROD_DB_PASSWORD,
    dbName: devApi ? process.env.DEV_DB_NAME : process.env.PROD_DB_NAME,
    dbHost: devApi ? process.env.DEV_DB_HOST : process.env.PROD_DB_HOST,
    dbDialect: 'mysql',

    appURL: devApp ? process.env.DEV_APP_URL : process.env.PROD_APP_URL,
    appURL2: devApp ? null : process.env.PROD_APP_URL2
}
