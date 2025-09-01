import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react": react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // Improved TypeScript and code quality rules
      "@typescript-eslint/no-unused-vars": [
        "warn", 
        { 
          "argsIgnorePattern": "^_", 
          "varsIgnorePattern": "^_" 
        }
      ],
      "no-console": [
        "warn", 
        { 
          "allow": ["error", "warn"] 
        }
      ],
      // Additional helpful rules
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "error", // Use the standard ESLint rule instead
      // Security: ensure rel on target=_blank
      "react/jsx-no-target-blank": ["warn", { "enforceDynamicLinks": "always" }],
      // A11y: enforce alt text on images where applicable
      "jsx-a11y/alt-text": ["warn", { "elements": ["img", "object", "area", "input[type=image]"] }],
    },
  }
);
