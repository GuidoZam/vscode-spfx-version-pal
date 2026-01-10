# GitHub Actions CI/CD Setup

This repository includes a GitHub Actions workflow that automatically tests and publishes the VS Code extension to the marketplace.

## Workflow Overview

The CI/CD pipeline includes two main jobs:

### 1. Test Job
- Runs on multiple platforms (Ubuntu, Windows, macOS)
- Tests with Node.js versions 18 and 20
- Compiles TypeScript
- Runs ESLint
- Executes extension tests

### 2. Publish Job
- Runs only on GitHub releases
- Packages the extension as .vsix
- Publishes to VS Code Marketplace
- Uploads .vsix as release asset

## Setup Required

### 1. VS Code Marketplace Token

1. Go to [Azure DevOps](https://dev.azure.com/)
2. Create a Personal Access Token with **Marketplace (Manage)** scope
3. Add it as a repository secret named `VSCODE_MARKETPLACE_TOKEN`

### 2. Repository Secrets

In your GitHub repository, go to Settings > Secrets and add:

```
VSCODE_MARKETPLACE_TOKEN = your-azure-devops-pat
```

### 3. Publisher Setup

1. Create a publisher account on [VS Code Marketplace](https://marketplace.visualstudio.com/manage)
2. Update the `publisher` field in `package.json` with your publisher ID
3. Ensure the publisher name matches your marketplace account

## Publishing Process

### Automatic Publishing (Recommended)

1. Update version in `package.json`
2. Create a GitHub release with tag format `v1.0.0`
3. The workflow will automatically:
   - Run tests
   - Package extension
   - Publish to marketplace
   - Upload .vsix to release

### Manual Publishing

```bash
# Install VSCE
npm install -g @vscode/vsce

# Package extension
npm run package

# Publish to marketplace
npm run publish
```

## Workflow Triggers

- **Push to main**: Runs tests only
- **Pull Request**: Runs tests only  
- **Release published**: Runs tests and publishes

## Requirements

- Node.js 18 or 20
- All tests must pass
- Publisher account on VS Code Marketplace
- Valid Azure DevOps PAT with Marketplace scope

## Troubleshooting

### Test Failures
- Check the Actions tab for detailed logs
- Tests run on multiple platforms - ensure cross-platform compatibility

### Publishing Failures
- Verify `VSCODE_MARKETPLACE_TOKEN` secret is set
- Ensure publisher name matches your marketplace account
- Check that version number follows semantic versioning

### Version Conflicts
- Marketplace versions cannot be republished
- Increment version number for new releases
- Use pre-release versions for testing (e.g., `1.0.0-beta.1`)