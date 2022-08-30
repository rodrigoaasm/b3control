const { pathsToModuleNameMapper } = require('ts-jest/utils')
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require('./tsconfig')

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    moduleDirectories: [
        ".",
        "node_modules"
    ],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths ,{ prefix: '<rootDir>/' })
};