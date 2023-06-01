---
inject: true
to: package.json
after: exports
skip_if: '"./hook"'
---
    "./hook": "./dist/esm/hook/index.js",