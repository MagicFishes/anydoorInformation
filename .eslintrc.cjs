module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'prettier',
       'plugin:import/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: ['react', 'prettier','import'],
    rules: {
      'prettier/prettier': 'error',
      'import/no-unresolved': 'off', // 关闭 import/no-unresolved 规则
      // 'no-unused-vars':'off'
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }