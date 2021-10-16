const path = require('path')
module.exports = function override(config) {
    config.resolve = {
        ...config.resolve,
        alias: {
            ...config.alias,
            '@src': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@contexts': path.resolve(__dirname, 'src/contexts'),
            '@svgs': path.resolve(__dirname, 'src/svgs'),
            '@styles': path.resolve(__dirname, 'src/styles'),
            '@pages': path.resolve(__dirname, 'src/pages'),
        },
    }
    return config
}
