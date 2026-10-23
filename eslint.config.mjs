// @ts-check
import eslint from '@eslint/js';
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
  prettier,
);
