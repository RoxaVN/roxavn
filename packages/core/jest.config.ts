export default {
  testEnvironment: 'node',
  roots: ['src', 'test'],
  testRegex: '.*\\.(e2e-)?spec\\.(ts|tsx)$',
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  transform: {
    '^.+\\.(ts|js|jsx|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
  coverageDirectory: '../coverage',
};
