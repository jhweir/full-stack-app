module.exports = {
    extends: ['airbnb-typescript-prettier'],
    rules: {
        // import prettierrc rules
        'prettier/prettier': 'error',
        // allow jsx files
        'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
        // disable react-hooks/exhaustive-deps
        'react-hooks/exhaustive-deps': 'off',
        // disable alias import errors
        'import/no-unresolved': 'off',
    },
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    ignorePatterns: ['config-overrides.js'],
}
