module.exports = {
  'env': {
    'commonjs': true,
    'es2021': false,
    'node': true,
    'es6': true
  },
  'extends': 'eslint:recommended',
  'overrides': [],
  'parserOptions': {
    'ecmaVersion': 'latest'
  },
  'rules': {
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always']
  }
};
