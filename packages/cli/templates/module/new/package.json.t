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
  "dependencies": {},
  "devDependencies": {
    "@roxavn/cli": "^0.1.0",
    "@roxavn/module-user": "^0.1.0",
    "typescript": "^5.0.4"
  },
  "peerDependencies": {
    "@mantine/core": "^6.0.0",
    "@remix-run/node": "^1.16.1",
    "@remix-run/react": "^1.16.1",
    "@roxavn/core": "^0.1.28",
    "@tabler/icons-react": "^2.12.0",
    "react": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "rxjs": "^7.2.0",
    "typeorm": "^0.3.10"
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
