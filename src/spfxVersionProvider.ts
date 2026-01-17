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
            this.statusBarItem.tooltip = `SharePoint Framework v${spfxInfo.version}\nProject: ${spfxInfo.projectName}${spfxInfo.relativePath ? `\nLocation: ${spfxInfo.relativePath}` : ''}\nClick to refresh`;
            this.statusBarItem.show();
        } else {
            this.statusBarItem.hide();
        }
    }

    private async detectSPFxVersion(): Promise<{ version: string, projectName: string, relativePath?: string } | null> {
        if (!vscode.workspace.workspaceFolders) {
            return null;
        }

        // Collect all SPFx projects found
        const spfxProjects: Array<{ version: string, projectName: string, path: string, workspacePath: string }> = [];

        for (const folder of vscode.workspace.workspaceFolders) {
            const foundProjects = await this.findSPFxProjectsInDirectory(folder.uri.fsPath);
            // Add workspace path info to each project
            const projectsWithWorkspace = foundProjects.map(project => ({
                ...project,
                workspacePath: folder.uri.fsPath
            }));
            spfxProjects.push(...projectsWithWorkspace);
        }

        // Return the first SPFx project found (prioritize by depth - deeper projects first)
        if (spfxProjects.length > 0) {
            // Sort by path depth (deeper paths first) to prioritize subprojects over root projects
            spfxProjects.sort((a, b) => {
                const aDepth = a.path.split(path.sep).length;
                const bDepth = b.path.split(path.sep).length;
                return bDepth - aDepth;
            });
            
            const selectedProject = spfxProjects[0];
            const relativePath = path.relative(selectedProject.workspacePath, selectedProject.path);
            
            return {
                version: selectedProject.version,
                projectName: selectedProject.projectName,
                relativePath: relativePath || undefined
            };
        }

        return null;
    }

    private async findSPFxProjectsInDirectory(dirPath: string): Promise<Array<{ version: string, projectName: string, path: string }>> {
        const spfxProjects: Array<{ version: string, projectName: string, path: string }> = [];
        
        try {
            // Check if current directory has package.json
            const packageJsonPath = path.join(dirPath, 'package.json');
            if (fs.existsSync(packageJsonPath)) {
                try {
                    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
                    const packageJson = JSON.parse(packageJsonContent);
                    
                    // Check if this is an SPFx project
                    const spfxVersion = SPFxVersionUtils.extractSPFxVersion(packageJson);
                    if (spfxVersion) {
                        spfxProjects.push({
                            version: spfxVersion,
                            projectName: packageJson.name || path.basename(dirPath),
                            path: dirPath
                        });
                    }
                } catch (error) {
                    console.error(`Error reading package.json at ${packageJsonPath}:`, error);
                }
            }

            // Recursively check subdirectories (but skip node_modules and common build/output folders)
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });
            const subDirectories = entries.filter(entry => 
                entry.isDirectory() && 
                !entry.name.startsWith('.') && 
                !['node_modules', 'dist', 'lib', 'temp', 'coverage', '.git'].includes(entry.name)
            );

            for (const subDir of subDirectories) {
                const subDirPath = path.join(dirPath, subDir.name);
                const subProjects = await this.findSPFxProjectsInDirectory(subDirPath);
                spfxProjects.push(...subProjects);
            }
        } catch (error) {
            // Silently ignore directories we can't read (permissions, etc.)
            console.debug(`Could not read directory ${dirPath}:`, error);
        }

        return spfxProjects;
    }

    dispose() {
        this.statusBarItem.dispose();
        if (this.fileWatcher) {
            this.fileWatcher.dispose();
        }
    }
}