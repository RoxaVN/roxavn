const { bootstrap } = require('@roxavn/dev-web');

bootstrap(process.cwd())
  .then((address) => console.log(`✅ App ready: ${address}`))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
