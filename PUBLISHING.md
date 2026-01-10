# GitHub Actions CI/CD Setup

This repository includes GitHub Actions workflows that automatically test and publish the VS Code extension to the marketplace.

## Workflow Overview

The CI/CD pipeline includes three workflows:

### 1. CI Workflow (`ci.yml`)
- Triggers: Push to main/develop, Pull Requests to main
- Runs on multiple platforms (Ubuntu, Windows, macOS)
- Tests with Node.js versions 18 and 20
- Compiles TypeScript
- Runs ESLint
- Executes extension tests

### 2. Release Workflow (`release.yml`)
- Triggers: When a GitHub release is published
- Runs tests, packages, and publishes to VS Code Marketplace
- Uploads .vsix file as release asset
- Only runs for non-prerelease releases

### 3. Manual Publish Workflow (`manual-publish.yml`)
- Triggers: Manual dispatch from GitHub Actions tab
- Allows publishing with optional version override
- Supports both regular and pre-release publishing
- Useful for hotfixes or testing releases

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

### 1. Automatic Publishing via Release (Recommended)

1. Update version in `package.json`
2. Create a GitHub release with tag format `v1.0.0`
3. The release workflow will automatically:
   - Run tests
   - Package extension
   - Publish to marketplace
   - Upload .vsix to release

### 2. Manual Publishing via GitHub Actions

1. Go to Actions tab in GitHub repository
2. Select "Manual Publish" workflow
3. Click "Run workflow"
4. Optionally specify version and pre-release flag
5. The workflow will handle testing and publishing

### 3. Local Manual Publishing

```bash
# Install VSCE
npm install -g @vscode/vsce

# Package extension
npm run package

# Publish to marketplace
npm run publish
```

## Workflow Triggers

- **CI Workflow**: Push to main/develop, Pull Requests to main
- **Release Workflow**: GitHub release published (non-prerelease only)
- **Manual Publish Workflow**: Manual dispatch from Actions tab

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