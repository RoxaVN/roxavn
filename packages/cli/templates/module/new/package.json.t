---
to: package.json
---
{
  "name": "<%= module_name %>",
  "version": "0.1.0",
  "scripts": {
    "build": "roxavn build",
    "dev": "roxavn dev"
  },
  "license": "UNLICENSED",
  "author": "",
  "roxavn": {},
  "sideEffects": false,
  "devDependencies": {
    "@roxavn/dev-web": "^0.1.0",
    "typescript": "^4.3.5"
  },
  "dependencies": {},
  "peerDependencies": {
    "@mantine/core": "*",
    "@remix-run/node": "*",
    "@remix-run/react": "*",
    "@roxavn/core": "*",
    "@roxavn/module-user": "*",
    "@tabler/icons": "*",
    "react": "*",
    "react-router-dom": "*",
    "rxjs": "*",
    "typeorm": "*"
  },
  "exports": {
    ".": "./dist/cjs/index.js",
    "./web": {
      "require": "./dist/cjs/web/index.js",
      "import": "./dist/esm/web/index.js"
    },
    "./base": {
      "require": "./dist/cjs/base/index.js",
      "import": "./dist/esm/base/index.js"
    },
    "./server": {
      "require": "./dist/cjs/server/index.js",
      "import": "./dist/esm/server/index.js"
    }
  },
  "typesVersions": {
    "*": {
      "web": [
        "dist/esm/web/index.d.ts"
      ],
      "base": [
        "dist/esm/base/index.d.ts"
      ],
      "server": [
        "dist/esm/server/index.d.ts"
      ]
    }
  },
  "files": [
    "/dist",
    "/static"
  ]
}
