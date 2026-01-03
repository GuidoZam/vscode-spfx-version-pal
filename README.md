# SPFx Version Pal

A Visual Studio Code extension that displays the SharePoint Framework (SPFx) version in the status bar for your SPFx projects.

## Visual

Examples of the extension in action:
![SPFx Version Pal Screenshot](assets/screenshot_01.png)
![SPFx Version Pal Screenshot](assets/screenshot_02.png)
![SPFx Version Pal Screenshot](assets/screenshot_03.png)
![SPFx Version Pal Screenshot](assets/screenshot_04.png)

## Features

- 🔍 Automatically detects SPFx projects by analyzing `package.json` dependencies
- 📊 Shows the SPFx version in the VS Code status bar
- 🔄 Automatically updates when package.json changes
- ⚡ Supports multiple workspace folders
- 🎯 Click to refresh version information

## How it works

The extension scans your workspace for `package.json` files and looks for common SPFx dependencies such as:

- `@microsoft/sp-core-library`
- `@microsoft/sp-webpart-base` 
- `@microsoft/sp-property-pane`
- `@microsoft/sp-office-ui-fabric-core`
- `@microsoft/sp-application-base`
- `@microsoft/generator-sharepoint`

When an SPFx project is detected, the version is extracted and displayed in the status bar with a package icon.

## Usage

1. Open any SPFx project in VS Code
2. The extension will automatically detect the SPFx version and display it in the status bar
3. Click on the status bar item to refresh the version information
4. Use the command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and search for "Refresh SPFx Version"

## Requirements

- Visual Studio Code 1.74.0 or higher
- A SharePoint Framework project with a valid `package.json` file

## Extension Settings

This extension doesn't contribute any VS Code settings.

## Known Issues

- The extension relies on package.json dependencies to detect SPFx version
- If SPFx dependencies are not explicitly listed, the version may not be detected

## Release Notes

### 0.0.1

Initial release of SPFx Version Pal

- Basic SPFx version detection
- Status bar display
- Auto-refresh on file changes

## Contributing

Feel free to contribute to this project by submitting issues or pull requests.

## License

See the [LICENSE](LICENSE) file for details.