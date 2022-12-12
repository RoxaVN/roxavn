import fs from 'fs';

if (fs.existsSync('./src/server/index.ts')) {
  // import typescript module for dev
  require('../src/server');
}

const serverConfigs = require('./server');

serverConfigs.callback = () => {
  if (fs.existsSync('./src/__hooks__/install.ts')) {
    // import __hooks__ module to install
    require('../src/__hooks__/install');
  }
};

export default {};
