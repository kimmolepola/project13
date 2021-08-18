module.exports = {
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  env: {
    commonjs: true,
    es6: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:styled-components-a11y/recommended',
    'prettier',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'jest', 'styled-components-a11y', 'prettier'],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-one-expression-per-line': 'off',
    'react/prop-types': 0,
    'react/jsx-props-no-spreading': 'off',
    'no-nested-ternary': 'off',
    'no-unused-vars': 'off',
    'no-console': 'off',
    'max-len': 'warn',
    'linebreak-style': 'off',
    'prettier/prettier': ['error', { singleQuote: true, trailingComma: 'all' }],
  },
  root: true,
};
