/* eslint-disable @typescript-eslint/naming-convention */
import * as assert from 'assert';
import { SPFxVersionUtils } from '../../spfxVersionUtils';

suite('SPFx Version Provider Test Suite', () => {
	test('Should create provider without throwing', () => {
		// Test that the provider can be imported and the utility functions work
		assert.ok(SPFxVersionUtils);
	});

	test('Should detect SPFx version from package.json', () => {
		const mockPackageJson = {
			name: 'test-spfx-project',
			dependencies: {
				'@microsoft/sp-core-library': '1.17.4',
				'@microsoft/sp-webpart-base': '1.17.4'
			}
		};

		const version = SPFxVersionUtils.extractSPFxVersion(mockPackageJson);
		assert.strictEqual(version, '1.17.4');
	});

	test('Should handle missing package.json gracefully', () => {
		const version = SPFxVersionUtils.extractSPFxVersion({});
		assert.strictEqual(version, null);
	});

	test('Should extract version from SPFx dependencies', () => {
		const mockPackageJson = {
			dependencies: {
				'@microsoft/sp-core-library': '^1.17.4',
				'react': '17.0.1'
			},
			devDependencies: {
				'@microsoft/sp-webpart-base': '~1.17.4'
			}
		};

		const version = SPFxVersionUtils.extractSPFxVersion(mockPackageJson);
		assert.strictEqual(version, '1.17.4');
	});

	test('Should clean version strings correctly', () => {
		const cleanedVersion = SPFxVersionUtils.cleanVersionString('^1.17.4');
		assert.strictEqual(cleanedVersion, '1.17.4');
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
});