try {
  // import typescript module for dev
  require('../src/server');
} catch (e) {}

const serverConfigs = require('./server');

serverConfigs.callback = () => {
  try {
    // import __hooks__ module to install
    require('../src/__hooks__/install');
  } catch (e) {}
};

export default {};
