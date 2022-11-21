module.exports = {
  testEnvironment: 'node',
  roots: ['src', 'test'],
  testRegex: '.*\\.(e2e-)?spec\\.(ts|tsx)$',
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  transform: {
    '^.+\\.(ts|js|tsx|jsx)$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(ts|js|tsx|jsx)'],
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
  coverageDirectory: './coverage',
};
