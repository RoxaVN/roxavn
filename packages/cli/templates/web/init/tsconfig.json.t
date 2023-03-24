---
inject: true
to: tsconfig.json
after: '"baseUrl"'
skip_if: '"module"'
sh: npx roxavn sync
---
    "module": "CommonJS",