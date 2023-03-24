---
inject: true
to: package.json
after: 'dist/cjs/index.js'
skip_if: 'web/init.js'
---
    "./web/init": {
      "require": "./dist/cjs/web/init.js",
      "import": "./dist/esm/web/init.js"
    },