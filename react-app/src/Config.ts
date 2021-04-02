const devApi = process.env.REACT_APP_API_ENV === 'dev'
const devApp = process.env.REACT_APP_APP_ENV === 'dev'

const config = {
    apiURL: devApi
        ? process.env.REACT_APP_DEV_API_URL
        : process.env.REACT_APP_PROD_API_URL,
    appURL: devApp
        ? process.env.REACT_APP_DEV_APP_URL
        : process.env.REACT_APP_PROD_APP_URL,
    recaptchaSiteKey: devApi
        ? process.env.REACT_APP_RECAPTCHA_SITE_KEY_DEV
        : process.env.REACT_APP_RECAPTCHA_SITE_KEY_PROD,
}

export default config
