# Publishing the VSCode Extension

This repository includes a GitHub Actions workflow for publishing the VSCode extension to the Visual Studio Code Marketplace.

## Prerequisites

Before you can use the publishing workflow, you need to set up the following:

### 1. VS Code Marketplace Publisher Account

1. Go to [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/manage)
2. Sign in with your Microsoft account
3. Create a publisher account if you haven't already
4. Note your publisher name (should match the `publisher` field in `package.json`)

### 2. Personal Access Token (PAT)

1. Go to [Azure DevOps](https://dev.azure.com/)
2. Sign in with the same Microsoft account used for the marketplace
3. Click on your profile picture → Security → Personal access tokens
4. Click "New Token"
5. Configure the token:
   - **Name**: `VSCode Extension Publishing`
   - **Organization**: `All accessible organizations`
   - **Expiration**: Choose appropriate duration
   - **Scopes**: Select `Custom defined` and check:
     - **Marketplace** → `Acquire` and `Manage`
6. Copy the generated token (you won't see it again!)

### 3. GitHub Repository Secret

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add a secret with:
   - **Name**: `VSCE_PAT`
   - **Value**: The personal access token you created above

## How to Publish

### Manual Publication

1. Go to your GitHub repository
2. Navigate to Actions tab
3. Click on "Publish Extension" workflow
4. Click "Run workflow"
5. Configure the publication options:
   - **Publication type**: 
     - `major`: For breaking changes (1.0.0 → 2.0.0)
     - `minor`: For new features (1.0.0 → 1.1.0)
     - `patch`: For bug fixes (1.0.0 → 1.0.1)
     - `prerelease`: For beta versions (1.0.0 → 1.0.1-beta.0)
   - **Dry run**: Check this to package the extension without publishing
6. Click "Run workflow"

### What the Workflow Does

1. **Checkout**: Gets the latest code
2. **Setup**: Installs Node.js and dependencies
3. **Quality Checks**: Runs linting and tests
4. **Version Bump**: Automatically increments the version number
5. **Build**: Compiles the TypeScript code
6. **Package**: Creates a `.vsix` file
7. **Publish**: (if not dry run) Publishes to VS Code Marketplace
8. **Git Operations**: (if not dry run) Commits version bump and creates a tag
9. **GitHub Release**: (if not dry run) Creates a GitHub release with the `.vsix` file

### Dry Run Mode

Use dry run mode to:
- Test the build process
- Generate a package for manual testing
- Verify everything works before actual publication

The `.vsix` file will be available as a GitHub Actions artifact for download.

## Version Management

The workflow automatically manages version numbers:
- Updates `package.json` and `package-lock.json`
- Creates a Git tag
- Commits the changes back to the main branch

## Troubleshooting

### Common Issues

1. **"Publisher not found" error**
   - Ensure the `publisher` in `package.json` matches your marketplace publisher name
   - Verify your PAT has the correct permissions

2. **"Authentication failed" error**
   - Check that your `VSCE_PAT` secret is correctly set
   - Verify the PAT hasn't expired

3. **Test failures**
   - The workflow will fail if tests don't pass
   - Fix any failing tests before publishing

4. **Linting errors**
   - The workflow will fail if linting finds issues
   - Run `npm run lint` locally to check for problems

### Manual Testing

You can test the package locally before publishing:

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the extension
npm run compile

# Package the extension
npm run package

# This creates a .vsix file you can install manually in VS Code
```

## Marketplace Links

After successful publication, your extension will be available at:
- **Marketplace**: https://marketplace.visualstudio.com/items?itemName=guidozam.vscode-spfx-version-pal
- **Publisher Page**: https://marketplace.visualstudio.com/publishers/guidozam