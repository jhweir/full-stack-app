module.exports = {
    extends: ['airbnb-typescript-prettier'],
    rules: {
        'prettier/prettier': 'error',
        'react-hooks/exhaustive-deps': 'off',
        // allow jsx files
        'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
    },
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
}
