/* eslint-disable @typescript-eslint/naming-convention */
import * as assert from 'assert';
import { SPFxVersionUtils } from '../../spfxVersionUtils';

suite('SPFx Version Utils Test Suite', () => {

	test('Should extract version from sp-core-library dependency', () => {
		const packageJson = {
			dependencies: {
				'@microsoft/sp-core-library': '1.17.4'
			}
		};

		const version = SPFxVersionUtils.extractSPFxVersion(packageJson);
		assert.strictEqual(version, '1.17.4');
	});

	test('Should extract version from sp-webpart-base dependency', () => {
		const packageJson = {
			dependencies: {
				'@microsoft/sp-webpart-base': '^1.16.0'
			}
		};

		const version = SPFxVersionUtils.extractSPFxVersion(packageJson);
		assert.strictEqual(version, '1.16.0');
	});

	test('Should extract pre-release versions from SPFx dependencies', () => {
		const packageJson = {
			dependencies: {
				'@microsoft/sp-core-library': '1.18.0-beta.1'
			}
		};

		const version = SPFxVersionUtils.extractSPFxVersion(packageJson);
		assert.strictEqual(version, '1.18.0-beta.1');
	});

	test('Should extract version from devDependencies', () => {
		const packageJson = {
			devDependencies: {
				'@microsoft/sp-property-pane': '~1.15.2'
			}
		};

		const version = SPFxVersionUtils.extractSPFxVersion(packageJson);
		assert.strictEqual(version, '1.15.2');
	});

	test('Should prefer sp-core-library over other packages', () => {
		const packageJson = {
			dependencies: {
				'@microsoft/sp-core-library': '1.17.4',
				'@microsoft/sp-webpart-base': '1.16.0'
			}
		};

		const version = SPFxVersionUtils.extractSPFxVersion(packageJson);
		assert.strictEqual(version, '1.17.4');
	});

	test('Should extract version from @types/sharepoint when no SPFx packages found', () => {
		const packageJson = {
			devDependencies: {
				'@types/sharepoint': '1.14.0'
			}
		};

		const version = SPFxVersionUtils.extractSPFxVersion(packageJson);
		assert.strictEqual(version, '1.14.0');
	});

	test('Should return null for non-SPFx projects', () => {
		const packageJson = {
			dependencies: {
				'react': '^17.0.0',
				'lodash': '^4.17.21'
			}
		};

		const version = SPFxVersionUtils.extractSPFxVersion(packageJson);
		assert.strictEqual(version, null);
	});

	test('Should clean version strings with caret prefix', () => {
		const version = SPFxVersionUtils.cleanVersionString('^1.17.4');
		assert.strictEqual(version, '1.17.4');
	});

	test('Should clean version strings with tilde prefix', () => {
		const version = SPFxVersionUtils.cleanVersionString('~1.16.0');
		assert.strictEqual(version, '1.16.0');
	});

	test('Should clean version strings with >= prefix', () => {
		const version = SPFxVersionUtils.cleanVersionString('>=1.15.2');
		assert.strictEqual(version, '1.15.2');
	});

	test('Should handle version strings without prefixes', () => {
		const version = SPFxVersionUtils.cleanVersionString('1.17.4');
		assert.strictEqual(version, '1.17.4');
	});

	test('Should return null for invalid version strings', () => {
		const version = SPFxVersionUtils.cleanVersionString('invalid-version');
		assert.strictEqual(version, null);
	});

	test('Should return null for empty version strings', () => {
		const version = SPFxVersionUtils.cleanVersionString('');
		assert.strictEqual(version, null);
	});

	test('Should identify SPFx projects correctly', () => {
		const spfxPackageJson = {
			dependencies: {
				'@microsoft/sp-core-library': '1.17.4'
			}
		};

		const nonSpfxPackageJson = {
			dependencies: {
				'react': '^17.0.0'
			}
		};

		assert.strictEqual(SPFxVersionUtils.isSPFxProject(spfxPackageJson), true);
		assert.strictEqual(SPFxVersionUtils.isSPFxProject(nonSpfxPackageJson), false);
	});

	test('Should handle missing dependencies object', () => {
		const packageJson = {
			name: 'test-project'
		};

		const version = SPFxVersionUtils.extractSPFxVersion(packageJson);
		assert.strictEqual(version, null);
	});

	test('Should extract version from any Microsoft SP package', () => {
		const packageJson = {
			dependencies: {
				'@microsoft/sp-office-ui-fabric-core': '1.17.4'
			}
		};

		const version = SPFxVersionUtils.extractSPFxVersion(packageJson);
		assert.strictEqual(version, '1.17.4');
	});

	test('Should handle complex version ranges', () => {
		const testCases = [
			{ input: "^1.17.4-beta.0", expected: "1.17.4-beta.0" },
			{ input: "1.17.4-rc.1", expected: "1.17.4-rc.1" },
			{ input: "~1.16.0-alpha.2", expected: "1.16.0-alpha.2" },
			{ input: ">=1.15.0-beta.3", expected: "1.15.0-beta.3" },
			{ input: "1.18.0-preview.4+build.123", expected: "1.18.0-preview.4" },
			{ input: "^1.17.4", expected: "1.17.4" }
		];

		testCases.forEach(testCase => {
			const version = SPFxVersionUtils.cleanVersionString(testCase.input);
			assert.strictEqual(version, testCase.expected, `Failed for input: ${testCase.input}`);
		});
	});

	test('Should prioritize packages in correct order', () => {
		const packageJson = {
			dependencies: {
				'@microsoft/generator-sharepoint': '1.15.0',
				'@microsoft/sp-webpart-base': '1.16.0',
				'@microsoft/sp-core-library': '1.17.4'
			}
		};

		// Should return sp-core-library version since it has highest priority
		const version = SPFxVersionUtils.extractSPFxVersion(packageJson);
		assert.strictEqual(version, '1.17.4');
	});

	test('Should handle mixed dependency sections', () => {
		const packageJson = {
			dependencies: {
				'react': '^17.0.0'
			},
			devDependencies: {
				'@microsoft/sp-build-web': '1.17.4'
			},
			peerDependencies: {
				'@microsoft/sp-core-library': '1.17.4'
			}
		};

		const version = SPFxVersionUtils.extractSPFxVersion(packageJson);
		assert.strictEqual(version, '1.17.4');
	});
});