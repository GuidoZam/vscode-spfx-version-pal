# Workflow Documentation

This project uses GitHub Actions for automated CI/CD processes. Here's how the workflows work together:

## Workflows Overview

### 1. Release Workflow (`release.yml`)

**Purpose**: Creates releases and optionally triggers the CI/CD pipeline.

**Trigger**: Manual dispatch with inputs
- `version`: Version to release (e.g., "1.0.0")
- `prerelease`: Whether this is a pre-release (default: false)
- `trigger_cicd`: Whether to trigger CI/CD workflow after release (default: true)

**Actions**:
1. Updates version in `package.json` and `package-lock.json`
2. Commits version changes to the repository
3. Creates a Git tag with the version (e.g., `v1.0.0`)
4. Creates a GitHub release
5. Optionally triggers the CI/CD workflow for marketplace publication

### 2. CI/CD Workflow (`ci-cd.yml`)

**Purpose**: Tests, builds, and publishes the extension to VS Code Marketplace.

**Triggers**:
- Push to main branch
- Pull requests to main branch
- Release published events
- Manual dispatch (with optional release_version input)
- Workflow call from other workflows (with optional release_version input)

**Jobs**:

#### Test Job
- Runs on multiple OS (Ubuntu, Windows, macOS) and Node.js versions (18, 20)
- Installs dependencies, compiles TypeScript, runs linting and tests

#### Publish Job
- **Condition**: Runs only when:
  - A release is published, OR
  - Triggered via workflow_call, OR
  - Triggered via workflow_dispatch with release_version, OR
  - Push to main with "Bump version to" in commit message

- **Actions**:
  1. Installs dependencies and compiles TypeScript
  2. Determines version based on trigger type
  3. Packages the extension as VSIX file
  4. Publishes to VS Code Marketplace using `VSCODE_MARKETPLACE_TOKEN`
  5. Uploads VSIX as release asset (release trigger) or workflow artifact (other triggers)

## Required Secrets

- `VSCODE_MARKETPLACE_TOKEN`: Personal Access Token for VS Code Marketplace
- `PAT_TOKEN`: GitHub Personal Access Token with repo permissions (optional, for triggering workflows)

## Workflow Integration

### Creating a Release and Publishing to Marketplace

1. **Manual Release**: Run the "Create Release" workflow with desired version
   - If `trigger_cicd` is true (default), it will automatically trigger the CI/CD workflow
   - The CI/CD workflow will then publish to the marketplace

2. **Direct CI/CD**: Run the "CI/CD Pipeline" workflow manually with a release version
   - This bypasses the release creation and goes straight to marketplace publication

### Automatic Triggers

- **Pull Requests**: CI/CD runs tests but skips publishing
- **Push to Main**: CI/CD runs tests; publishes only if commit message contains "Bump version to"
- **Release Published**: CI/CD runs tests and publishes to marketplace automatically

## Troubleshooting

### CI/CD Workflow Not Triggered After Release

**Issue**: The release workflow doesn't automatically trigger the CI/CD workflow.

**Solutions**:
1. Ensure `PAT_TOKEN` secret is set with appropriate permissions
2. Check that `trigger_cicd` input is set to `true` when running the release workflow
3. Verify the CI/CD workflow file exists and is valid

### Marketplace Publishing Skipped

**Issue**: The publish job doesn't run even when expected.

**Possible Causes**:
1. Publish job condition not met (check the workflow run logs)
2. Missing `VSCODE_MARKETPLACE_TOKEN` secret
3. Version extraction failed (check version determination step logs)

**Solutions**:
1. Verify the trigger conditions in the publish job `if` statement
2. Ensure required secrets are properly configured
3. Check that package.json has a valid version field

### Version Extraction Issues

The workflow determines the version differently based on trigger:
- **Release event**: Extracts from git tag (removes `v` prefix)
- **Workflow call/dispatch**: Uses provided `release_version` input
- **Push with version bump**: Reads from package.json

Make sure the version source matches your trigger method.