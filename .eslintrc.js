module.exports = {
  root: true,
  extends: '@react-native',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  ignorePatterns: ['web/dist/**'],
  rules: {
    'dot-notation': 'off',
    'no-alert': 'off',
    'no-return-assign': 'off',
    'no-shadow': 'off',
    'no-unused-vars': 'off',
    'no-useless-escape': 'off',
    radix: 'off',
    'react-native/no-inline-styles': 'off',
    'react/no-unstable-nested-components': 'off',
  },
  overrides: [
    {
      files: ['backend/**/*.js', '*.js'],
      env: {
        node: true,
      },
    },
    {
      files: ['web/**/*.js', 'web/**/*.jsx'],
      env: {
        browser: true,
      },
    },
  ],
};
