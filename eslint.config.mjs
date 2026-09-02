import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Capacitor copies the built web assets into the native projects on
    // sync, so linting these means linting minified output — every warning
    // is about generated code nobody wrote.
    "android/**",
    "ios/**",
    // Playwright output
    "test-results/**",
    "playwright-report/**",
  ]),
]);

export default eslintConfig;
