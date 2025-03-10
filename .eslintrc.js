module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: [
      "@typescript-eslint"
    ],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-type-checked",
    ],
    parserOptions: {
        sourceType: "module",
        project: true,
        tsconfigRootDir: __dirname,
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 2,
      '@typescript-eslint/no-var-requires': 0, //disable errors due to "require" usage
      "no-console": 2,
    }
  }