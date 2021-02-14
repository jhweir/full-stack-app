const local = true;
module.exports = {
    apiURL: local ? 'http://localhost:5000/api' : 'https://api.weco.io/api',
    appURL: local ? 'http://localhost:3000/' : 'https://weco.io/'
}