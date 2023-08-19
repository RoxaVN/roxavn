---
to: .prettierrc
sh: 'npm install --save-dev @commitlint/config-conventional @commitlint/cli @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-prettier husky lint-staged standard-version
  && npm pkg set scripts.prepare="husky install"
  && npm run prepare
  && npx husky add .husky/commit-msg "npx --no -- commitlint --edit ${1}"
  && npx husky add .husky/pre-commit "npx lint-staged"'
---
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "jsxSingleQuote": false,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "requirePragma": false,
  "insertPragma": false,
  "proseWrap": "preserve",
  "htmlWhitespaceSensitivity": "strict",
  "vueIndentScriptAndStyle": false,
  "endOfLine": "lf",
  "embeddedLanguageFormatting": "auto"
}
