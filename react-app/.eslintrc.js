module.exports = {
    extends: ['airbnb-typescript-prettier'],
    rules: {
        'prettier/prettier': 'error',
        'react-hooks/exhaustive-deps': 'off',
    },
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
}
