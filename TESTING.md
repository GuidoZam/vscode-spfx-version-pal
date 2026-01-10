# Testing Guide

## Test Structure

The extension includes comprehensive tests following VS Code's testing guidelines:

### Test Files
- `src/test/runTest.ts` - Test runner entry point
- `src/test/suite/index.ts` - Mocha test suite configuration
- `src/test/suite/extension.test.ts` - Extension activation and command tests
- `src/test/suite/spfxVersionProvider.test.ts` - Provider integration tests
- `src/test/suite/spfxVersionUtils.test.ts` - Utility function unit tests

## Running Tests

### Via VS Code
1. Open the project in VS Code
2. Press `F5` to open the Extension Development Host
3. Go to Debug panel and select "Extension Tests"
4. Press `F5` to run tests

### Via Command Line
```bash
npm test
```

### Via npm scripts
```bash
# Run linting
npm run lint

# Compile and run tests
npm run pretest

# Run just the tests (requires compilation first)
npm test
```

## Test Categories

### Unit Tests (`spfxVersionUtils.test.ts`)
Tests the core SPFx version detection logic:
- Version extraction from different dependency types
- Version string cleaning and parsing
- SPFx project detection
- Handling edge cases and invalid input

### Integration Tests (`spfxVersionProvider.test.ts`)
Tests the provider class:
- Status bar item creation
- File watching setup
- Refresh functionality
- Resource disposal

### Extension Tests (`extension.test.ts`)
Tests the extension lifecycle:
- Extension activation
- Command registration
- VS Code integration

## Test Framework

- **Framework**: Mocha with TDD interface
- **Assertions**: Node.js built-in `assert` module
- **VS Code Testing**: `@vscode/test-electron` package
- **Coverage**: Available through npm scripts

## Mock Data

Tests use mock package.json structures to simulate different SPFx project configurations:

```typescript
const mockPackageJson = {
  dependencies: {
    '@microsoft/sp-core-library': '1.17.4'
  }
};
```

## Continuous Integration

The test suite can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: |
    npm ci
    npm run compile
    npm test
```

## Adding New Tests

1. Create test files in `src/test/suite/`
2. Follow the naming convention: `*.test.ts`
3. Use the TDD interface with `suite()` and `test()` functions
4. Import the modules you want to test
5. Use Node.js `assert` for assertions

Example:
```typescript
import * as assert from 'assert';
import { SPFxVersionUtils } from '../../spfxVersionUtils';

suite('My Test Suite', () => {
  test('Should do something', () => {
    const result = SPFxVersionUtils.cleanVersionString('^1.17.4');
    assert.strictEqual(result, '1.17.4');
  });
});
```