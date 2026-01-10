import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { SPFxVersionUtils } from './spfxVersionUtils';

export class SPFxVersionProvider {
    private statusBarItem: vscode.StatusBarItem;
    private fileWatcher: vscode.FileSystemWatcher | undefined;

    constructor(private context: vscode.ExtensionContext) {
        // Create status bar item
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        this.statusBarItem.command = 'spfxVersionPal.refresh';
        this.statusBarItem.tooltip = 'Click to refresh SPFx version';
        this.context.subscriptions.push(this.statusBarItem);

        // Initial check
        this.updateVersion();

        // Watch for workspace changes
        this.setupFileWatcher();

        // Listen to workspace folder changes
        vscode.workspace.onDidChangeWorkspaceFolders(() => {
            this.setupFileWatcher();
            this.updateVersion();
        });
    }

    private setupFileWatcher() {
        // Dispose existing watcher
        if (this.fileWatcher) {
            this.fileWatcher.dispose();
        }

        // Create new watcher for package.json files
        this.fileWatcher = vscode.workspace.createFileSystemWatcher('**/package.json');
        
        this.fileWatcher.onDidCreate(() => this.updateVersion());
        this.fileWatcher.onDidChange(() => this.updateVersion());
        this.fileWatcher.onDidDelete(() => this.updateVersion());

        this.context.subscriptions.push(this.fileWatcher);
    }

    public refresh() {
        this.updateVersion();
        vscode.window.showInformationMessage('SPFx version refreshed');
    }

    private async updateVersion() {
        const spfxInfo = await this.detectSPFxVersion();
        
        if (spfxInfo) {
            this.statusBarItem.text = `$(milestone) SPFx ${spfxInfo.version}`;
            this.statusBarItem.tooltip = `SharePoint Framework v${spfxInfo.version}\nProject: ${spfxInfo.projectName}\nClick to refresh`;
            this.statusBarItem.show();
        } else {
            this.statusBarItem.hide();
        }
    }

    private async detectSPFxVersion(): Promise<{ version: string, projectName: string } | null> {
        if (!vscode.workspace.workspaceFolders) {
            return null;
        }

        for (const folder of vscode.workspace.workspaceFolders) {
            const packageJsonPath = path.join(folder.uri.fsPath, 'package.json');
            
            try {
                if (fs.existsSync(packageJsonPath)) {
                    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
                    const packageJson = JSON.parse(packageJsonContent);
                    
                    // Check if this is an SPFx project
                    const spfxVersion = SPFxVersionUtils.extractSPFxVersion(packageJson);
                    if (spfxVersion) {
                        return {
                            version: spfxVersion,
                            projectName: packageJson.name || folder.name
                        };
                    }
                }
            } catch (error) {
                console.error('Error reading package.json:', error);
            }
        }

        return null;
    }

    dispose() {
        this.statusBarItem.dispose();
        if (this.fileWatcher) {
            this.fileWatcher.dispose();
        }
    }
}