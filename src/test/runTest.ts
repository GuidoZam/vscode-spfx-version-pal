import * as path from 'path';

import { runTests } from '@vscode/test-electron';

async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../../');

		// The path to test runner
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		console.log('Starting VS Code extension tests...');

		// Download VS Code, unzip it and run the integration test
		await runTests({ 
			extensionDevelopmentPath, 
			extensionTestsPath,
			// Add options for better headless support
			launchArgs: [
				'--disable-extensions',
				'--disable-gpu',
				'--disable-dev-shm-usage',
				'--no-sandbox',
				'--disable-web-security',
				'--disable-setuid-sandbox',
				'--disable-background-timer-throttling',
				'--disable-backgrounding-occluded-windows',
				'--disable-renderer-backgrounding',
				'--disable-features=TranslateUI',
				'--disable-default-apps'
			]
		});

		console.log('✅ All tests passed successfully!');
	} catch (err) {
		console.error('❌ Tests failed:', err);
		process.exit(1);
	}
}

main();