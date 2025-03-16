// @ts-check

import globals from 'globals'
import tseslint from 'typescript-eslint'
import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default tseslint.config(
  {
    ignores: [
        '!packages/node_modules/**',
        'packages/*/**/node_modules/**',
        '**/lib/**',
        '**/es/**',
        '**/dist/**',
        '**/build/**',
      '**/*.min.js',
      '**/bundle.js',
      '**/coverage/**',
      '**/.nyc_output/**',
      '**/vendor/**',
      '**/*.d.ts',
    ],
  },
  js.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2022,
        projectService: true,
        projectFolderIgnoreList: [
          '!packages/node_modules/**',
          'packages/*/**/node_modules/**'
        ]
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      'linebreak-style': ['error', 'unix'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-vars': 'off',
      'import/export': 'off',
      'no-dupe-class-members': 'off',
      'no-empty-pattern': 'off',
      'no-redeclare': 'off',
      'no-undef': 'off',
      'no-unused-expressions': 'off',
      'no-use-before-define': 'off',
      'no-useless-constructor': 'off',
    },
  },
  eslintConfigPrettier,
  {
    // disable type-aware linting on JS files
    files: ['**/*.{js,cjs,mjs,jsx}'],
    extends: [tseslint.configs.disableTypeChecked],
  },
)
