import 'babel-polyfill'; 
import * as commands from './commands';
import * as vscode from 'vscode';
import {registerBackupProvider} from './backup_provider';
import {FSBackupProvider} from './backup_providers/fs';

export function activate(context: vscode.ExtensionContext) {

	console.log('"code-sync" is now active!'); 
	
	// register backup provider
	registerBackupProvider("fs", FSBackupProvider);

	let cmd1 = vscode.commands.registerCommand('codesync.backup', () => {
		return commands.backup();
	});
	context.subscriptions.push(cmd1);
	
	let cmd2 = vscode.commands.registerCommand('codesync.restore', () => {
		commands.restore();
	});
	context.subscriptions.push(cmd2);
	
	/*let cmd3 = vscode.commands.registerCommand('codesync.show', () => {
		commands.show();
	});
	context.subscriptions.push(cmd3);*/
}
