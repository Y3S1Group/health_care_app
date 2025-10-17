module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  
  // Add this line to transform uuid
  transformIgnorePatterns: [
    'node_modules/(?!uuid)'
  ],
  
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/**/index.ts'
  ],
  
  coverageDirectory: 'coverage',
  verbose: true
};