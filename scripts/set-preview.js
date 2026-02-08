#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to set the 'preview' field in package.json
 * Usage: node set-preview.js [true|false]
 */

function setPreview(value) {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
        console.error('Error: package.json not found in current directory');
        process.exit(1);
    }
    
    try {
        // Read package.json
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        // Set preview value
        packageJson.preview = value;
        
        // Write back to package.json with proper formatting
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, '\t') + '\n');
        
        console.log(`Successfully set preview to ${value} in package.json`);
    } catch (error) {
        console.error(`Error updating package.json: ${error.message}`);
        process.exit(1);
    }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length !== 1) {
    console.error('Usage: node set-preview.js [true|false]');
    process.exit(1);
}

const previewValue = args[0].toLowerCase();

if (previewValue === 'true') {
    setPreview(true);
} else if (previewValue === 'false') {
    setPreview(false);
} else {
    console.error('Error: Argument must be either "true" or "false"');
    process.exit(1);
}