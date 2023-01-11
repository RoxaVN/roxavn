---
inject: true
to: package.json
after: exports
skip_if: '"./hook"'
---
    "./hook": "./dist/cjs/hook/index.js",