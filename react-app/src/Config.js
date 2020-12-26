const local = true;
module.exports = {
    apiURL: local ? 'http://localhost:5000/api' : 'http://54.246.53.102/api',
    appURL: local ? 'http://localhost:3000/' : 'http://new.weco.io/'
}