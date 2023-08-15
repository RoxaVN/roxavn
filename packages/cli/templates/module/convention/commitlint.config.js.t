---
to: commitlint.config.js
sh: npm i -D @commitlint/{config-conventional,cli} @typescript-eslint/{eslint-plugin, parser} eslint eslint-config-prettier eslint-plugin-prettier husky lint-staged standard-version && npm pkg set scripts.prepare="husky install" && npm run prepare && npx husky add .husky/commit-msg  'npx --no -- commitlint --edit ${1}'
---
module.exports = { extends: ['@commitlint/config-conventional'] };
