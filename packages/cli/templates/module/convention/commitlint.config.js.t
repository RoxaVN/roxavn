---
to: commitlint.config.js
sh: npm install --save-dev @commitlint/config-conventional @commitlint/cli @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-prettier husky lint-staged standard-version && npm pkg set scripts.prepare="husky install" && npm run prepare && npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}' && npx husky add .husky/pre-commit 'npx lint-staged'
---
export default { extends: ['@commitlint/config-conventional'] };
