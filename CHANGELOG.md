# Change Log

All notable changes to the "SPFx Version Pal" extension will be documented in this file.

## [0.0.4] - 2026-01-19

### Fixed
- Fixed "Cannot find module 'semver'" error when extension is installed from marketplace
- Dependencies are now properly bundled with the extension

### Changed
- Migrated from TypeScript compilation to webpack bundling for production builds
- Updated build process to bundle all dependencies into a single output file
- Changed main entry point from `./out/extension.js` to `./dist/extension.js`

### Technical
- Added webpack, ts-loader, and webpack-cli as development dependencies
- Created webpack.config.js for proper bundling configuration
- Updated npm scripts to use webpack for building and packaging
- Updated .vscodeignore to exclude source files but include bundled distribution files
- Added separate compilation pipeline for tests while using webpack for production

## [0.0.3] - 2026-01-17

### Added
- Recursive scanning for SPFx projects in subdirectories
- Support for complex workspace structures (e.g., Teams Toolkit projects)

### Changed
- Improved project detection to prioritize SPFx projects in deeper subdirectories
- Better handling of multi-project workspaces

### Technical
- Added `findSPFxProjectsInDirectory()` method for recursive directory scanning
- Updated `detectSPFxVersion()` to handle multiple projects and prioritization logic
- Maintained backward compatibility with existing single-project workspaces

## [0.0.2] - 2026-01-11

### Changed
- Updated README file.

## [0.0.1] - 2026-01-03

### Added
- Initial release
- SPFx version detection from package.json dependencies
- Status bar display with package icon
- Auto-refresh on package.json changes
- Support for multiple workspace folders
- Refresh command in command palette
- Tooltip showing project name and version details