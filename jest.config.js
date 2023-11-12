/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/__mocks__/prisma.ts'],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  moduleNameMapper: {
    '^#/(.*)$': '<rootDir>/src/$1',
  },
};
