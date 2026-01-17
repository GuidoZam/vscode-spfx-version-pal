# Change Log

All notable changes to the "SPFx Version Pal" extension will be documented in this file.

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