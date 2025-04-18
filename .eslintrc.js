module.exports = {
    env: {
      node: true,
      es2021: true,
    },
    extends: ['standard-with-typescript'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: ['./tsconfig.json'],
    },
    plugins: ['@typescript-eslint'],
    rules: {
      // Reglas suaves
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/strict-boolean-expressions': 'off',
    },
  };
  