try {
  // import typescript module for dev
  require('../src/server').useApis();
} catch (e) {}

require('./server');

export default {};
