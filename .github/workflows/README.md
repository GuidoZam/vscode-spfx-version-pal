# GitHub Workflows

This directory contains GitHub Actions workflows for the SPFx Version Pal VS Code extension.

## Workflows

### 1. `ci.yml` - Continuous Integration
**Purpose:** Runs tests and quality checks on code changes

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` branch

**What it does:**
- Tests on Ubuntu, Windows, and macOS
- Uses Node.js versions 18 and 20
- Compiles TypeScript
- Runs ESLint
- Executes extension tests

### 2. `release.yml` - Automatic Release
**Purpose:** Publishes extension when a GitHub release is created

**Triggers:**
- GitHub release published (non-prerelease only)

**What it does:**
- Runs full test suite
- Packages extension as `.vsix`
- Publishes to VS Code Marketplace
- Uploads `.vsix` file to the release

**Requirements:**
- `VSCODE_MARKETPLACE_TOKEN` secret must be set
- Release must not be marked as prerelease

### 3. `manual-publish.yml` - Manual Publishing
**Purpose:** Allows on-demand publishing with more control

**Triggers:**
- Manual dispatch from GitHub Actions tab

**Options:**
- **version**: Override package.json version (optional)
- **prerelease**: Publish as pre-release version (optional)

**What it does:**
- Optionally updates version
- Runs full test suite
- Packages extension
- Publishes to marketplace (regular or pre-release)
- Uploads `.vsix` as artifact

## Setup Requirements

### 1. Repository Secrets
Add these secrets in GitHub repository settings:

- `VSCODE_MARKETPLACE_TOKEN`: Azure DevOps Personal Access Token with Marketplace (Manage) scope

### 2. Publisher Account
- Create account at [VS Code Marketplace](https://marketplace.visualstudio.com/manage)
- Ensure `publisher` field in `package.json` matches your marketplace account

### 3. Azure DevOps Token
1. Go to [Azure DevOps](https://dev.azure.com/)
2. Create Personal Access Token
3. Grant **Marketplace (Manage)** scope
4. Add as `VSCODE_MARKETPLACE_TOKEN` secret

## Usage Examples

### Publishing a New Version
1. Update `version` in `package.json`
2. Create GitHub release with tag `v1.0.0`
3. Release workflow automatically publishes

### Publishing a Hotfix
1. Go to Actions → Manual Publish
2. Set version (e.g., `1.0.1`)
3. Run workflow

### Publishing a Beta Version
1. Go to Actions → Manual Publish  
2. Set version (e.g., `1.1.0-beta.1`)
3. Check "prerelease" option
4. Run workflow

## Troubleshooting

### Common Issues

**Test failures:**
- Check platform-specific test results
- Ensure code works on all platforms (Windows, macOS, Linux)

**Publishing failures:**
- Verify marketplace token is valid
- Check publisher name matches marketplace account
- Ensure version number hasn't been used before

**Version conflicts:**
- Marketplace doesn't allow republishing same version
- Increment version number for new releases
- Use semantic versioning (major.minor.patch)

### Getting Help
- Check workflow logs in Actions tab
- Review VS Code extension publishing documentation
- Verify marketplace account permissions