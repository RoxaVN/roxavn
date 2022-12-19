import fs from 'fs';

if (fs.existsSync('./src/server/index.ts')) {
  // import typescript module for dev
  require('../src/server');
}

require('./server');

export default {};
