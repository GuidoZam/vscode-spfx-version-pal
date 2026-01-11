import * as vscode from 'vscode';
import { SPFxVersionProvider } from './spfxVersionProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('SPFx Version Pal extension is now active');

    // Create the SPFx version provider
    const spfxVersionProvider = new SPFxVersionProvider(context);

    // Register the refresh command
    const refreshCommand = vscode.commands.registerCommand('spfxVersionPal.refresh', () => {
        spfxVersionProvider.refresh();
    });

    context.subscriptions.push(refreshCommand);
}

export function deactivate() {
    console.log('SPFx Version Pal extension is now deactivated');
}