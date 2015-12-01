import * as commands from './commands';
import * as vscode from 'vscode'; 

export function activate(context: vscode.ExtensionContext) {

	console.log('"code-sync" is now active!'); 

	let cmd1 = vscode.commands.registerCommand('codesync.backup', () => {
		commands.backup();
	});
	context.subscriptions.push(cmd1);
	
	/*let cmd2 = vscode.commands.registerCommand('codesync.restore', () => {
		commands.restore();
	});
	context.subscriptions.push(cmd2);
	
	let cmd3 = vscode.commands.registerCommand('codesync.show', () => {
		commands.show();
	});
	context.subscriptions.push(cmd3);*/
}
