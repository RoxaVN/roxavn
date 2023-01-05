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
  "devDependencies": {
    "@roxavn/dev-web": "^0.1.0",
    "typescript": "^4.3.5"
  },
  "dependencies": {
    "@mantine/core": "*",
    "@roxavn/core": "*",
    "@roxavn/module-user": "*",
    "@tabler/icons": "*",
    "react": "*",
    "react-router-dom": "*",
    "rxjs": "*",
    "typeorm": "*"
  },
  "exports": {
    "./web": {
      "require": "./dist/cjs/web/index.js",
      "import": "./dist/esm/web/index.js"
    },
    "./share": {
      "require": "./dist/cjs/share/index.js",
      "import": "./dist/esm/share/index.js"
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
      "share": [
        "dist/esm/share/index.d.ts"
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