---
inject: true
to: package.json
after: 'dist/esm/index.js'
skip_if: 'web/init.js'
---
    "./web/init": "./dist/esm/web/init.js",