// @ts-check
import eslint from '@eslint/js';
import boundaries from 'eslint-plugin-boundaries';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules', '*.config.mjs'] },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      // Nest DI relies on emitted decorator metadata, so type-only imports break it.
      '@typescript-eslint/consistent-type-imports': 'off',
      // Nest modules/providers are empty decorated classes.
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
  {
    files: ['src/**/*.ts'],
    plugins: { boundaries },
    settings: {
      'import/resolver': { typescript: { project: './tsconfig.json' } },
      'boundaries/elements': [
        {
          type: 'module',
          pattern: 'src/modules/*',
          capture: ['name'],
        },
      ],
    },
    rules: {
      // A module may import itself and other modules' public facade (index.ts) only.
      'boundaries/dependencies': [
        2,
        {
          default: 'allow',
          policies: [
            {
              from: { element: { type: 'module' } },
              disallow: {
                to: {
                  element: {
                    type: 'module',
                    captured: { name: '!{{ from.element.captured.name }}' },
                    fileInternalPath: '!index.ts',
                  },
                },
              },
              message:
                'Import {{ to.element.captured.name }} through its public facade (index.ts) only.',
            },
          ],
        },
      ],
    },
  },
  prettier,
);
