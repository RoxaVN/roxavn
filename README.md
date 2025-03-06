## What is RoxaVN?

RoxaVN is a full stack web framework, designed in a modularized architecture. Each module can be used independently as a separate service, or run multiple modules at the same time as monolithic architecture. RoxaVN is designed according to the KISS principle (Keep it simple, stupid). Each module is designed with the most basic features, to be able to work independently and reuse in many places.

## Why Use RoxaVN?

- It has a secure auto-generated TypeScript API model and classes that are consumed by frontend type-safe queries that can also be used as third-party applications.
- It uses a type-safe coding style to find and manipulate data on both the backend and frontend code.
- It has many modules available that are easy to reuse for all areas such as games, social networks, erp, e-commerce, blockchain...

## Quickstart

Create a simple module

```
npx @roxavn/cli gen module
```

Add available modules

```
npm i @roxavn/module-user @roxavn/module-project
```

Synchronize modules

```
npx roxavn sync
```

Run dev server

```
npm run dev
```

## Documentation

For documentation about RoxaVN, please visit [our wiki](https://github.com/RoxaVN/roxavn/wiki)

## Tech stack

- [Remix](https://remix.run/) a full stack web framework
- [Vite](https://vitejs.dev/) next generation frontend tooling
- [Kysely](https://kysely.dev/) TypeScript SQL query builder
- [I18next](https://www.i18next.com/) an internationalization-framework
- [Mantine](https://mantine.dev/) a fully featured React components library
- [Tabler Icons](https://tabler-icons.io/) free and open source icons
- [ES-toolkit](https://es-toolkit.slash.page/) a modern JavaScript utility library

## License

RoxaVN is [MIT Licensed](https://github.com/RoxaVN/roxavn/blob/master/LICENSE).
