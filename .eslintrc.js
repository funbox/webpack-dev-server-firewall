module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    '@funboxteam/eslint-config',
    'plugin:security/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: [
    'fp',
    '@typescript-eslint',
    'import',
  ],
  ignorePatterns: [
    'node_modules/',
    '.npm',
    'public/',
    'src/api-schemas/',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: 'tsconfig.json',
      },
    },
  },
  rules: {
    'comma-dangle': [
      'error',
      'only-multiline'
    ],
    'no-console': 'error',
    'import/no-default-export': 'error',
    'arrow-parens': ['error', 'as-needed'],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
    'padding-line-between-statements': [
      'error',

      { blankLine: 'always', prev: '*', next: ['return', 'break', 'default'] },

      { blankLine: 'always', prev: ['const', 'let', 'var', 'if'], next: '*' },
      { blankLine: 'always', prev: '*', next: ['const', 'let', 'var', 'if'] },

      { blankLine: 'any', prev: ['const', 'let', 'var', 'if'], next: ['const', 'let', 'var', 'if'] },
      { blankLine: 'always', prev: ['multiline-const', 'multiline-let', 'multiline-block-like', 'multiline-expression'], next: '*' },
      { blankLine: 'always', prev: '*', next: ['multiline-const', 'multiline-let', 'multiline-block-like', 'multiline-expression'] },
    ],
    'object-property-newline': [
      'error',
      { allowAllPropertiesOnSameLine: true }
    ],

    'max-len': [
      'error',
      {
        code: 120,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true
      }
    ],
    'fp/no-mutating-assign': 'error',

    'fp/no-mutating-methods': ['error', {
      allowedObjects: ['history', 'EditorState']
    }],
    'security/detect-object-injection': 'off',
    'security/detect-non-literal-regexp': 'off',
    'security/detect-unsafe-regex': 'off',

    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-var-reqiures': 'off',
    'import/extensions': 0,
  },
};
