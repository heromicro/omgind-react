module.exports = {
  // parser: '@babel/eslint-parser',
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
      plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
      // "sourceType": "module"
    },
  },
  plugins: ['@typescript-eslint', 'compat'],
  extends: [
    'airbnb',
    'prettier',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:compat/recommended',
    // https://typescript-eslint.io/rules/
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:compat/recommended',
    'plugin:react/jsx-runtime',
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  globals: {
    APP_TYPE: true,
    page: true,
  },
  rules: {
    'import/prefer-default-export': 'warn',
    'compat/compat': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    'class-methods-use-this': 'warn',
    'react/function-component-definition': 'warn',
    'react/display-name': 'warn',
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
    'react/jsx-wrap-multilines': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': 'warn',
    'react/state-in-constructor': 'warn',
    'react/no-unused-class-component-methods': 'warn',
    'react/sort-comp': 'warn',
    'react/no-unstable-nested-components': 'warn',
    'import/no-unresolved': [2, { ignore: ['^@/', '^umi/'] }],
    'import/no-extraneous-dependencies': [
      2,
      {
        optionalDependencies: true,
        devDependencies: ['**/tests/**.js', '/mock/**.js', '**/**.test.js'],
      },
    ],
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'linebreak-style': 0,
    'import/extensions': 0,
    // 'import/no-extraneous-dependencies': 0,
    'no-unused-vars': 0,
    'prefer-const': 0,
    'no-irregular-whitespace': 0,
    'lines-between-class-members': [
      'error',
      'always',
      {
        exceptAfterSingleLine: true,
      },
    ],
  },
  settings: {
    polyfills: ['fetch', 'promises', 'url'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
