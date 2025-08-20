module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }]
  },
  overrides: [
    {
      files: ["scripts/**", "server/**", "**/*.config.{js,cjs}"],
      rules: {
        "@typescript-eslint/no-require-imports": "off"
      }
    }
  ]
};
