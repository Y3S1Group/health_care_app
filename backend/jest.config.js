module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: [
    'src//*.ts',
    '!src//*.d.ts',
    '!src/server.ts',
    '!src/app.ts',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};