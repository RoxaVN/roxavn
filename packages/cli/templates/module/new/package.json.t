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
  "license": "MIT",
  "author": "roxavn",
  "type": "module",
  "roxavn": {},
  "sideEffects": false,
  "devDependencies": {
    "@roxavn/cli": "^0.1.0",
    "typescript": "^5.0.4"
  },
  "dependencies": {},
  "peerDependencies": {
    "@mantine/core": "*",
    "@remix-run/node": "*",
    "@remix-run/react": "*",
    "@roxavn/core": "*",
    "@roxavn/module-user": "*",
    "@tabler/icons-react": "*",
    "react": "*",
    "react-router-dom": "*",
    "rxjs": "*",
    "typeorm": "*"
  },
  "exports": {
    ".": "./dist/esm/index.js",
    "./web": "./dist/esm/web/index.js",
    "./base": "./dist/esm/base/index.js",
    "./server": "./dist/esm/server/index.js"
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
