import * as vscode from 'vscode';
import * as config_provider from './config_provider';
import * as backup_provider from './backup_provider';

export function backup()
{
	console.log("Start full backup...");
	let configp = config_provider.getConfigProvider();
	let backupp = backup_provider.getBackupProvider();
	
	configp.getConfigs(false).forEach(config => {
		let configDest = backupp.getConfig(config, false);
		configDest.replaceBy(config);
	});
	
	backupp.save();
}

export function restore()
{
	console.log("Start full restore...");
	let configp = config_provider.getConfigProvider();
	let backupp = backup_provider.getBackupProvider();
	
	backupp.getConfigs(false).forEach(config => {
		let configDest = configp.getConfig(config, false);
		configDest.replaceBy(config);
	});
	
	configp.save();
}

export function show()
{
	vscode.commands.getCommands().then((value:string[]) => {
		vscode.window.showQuickPick(value);
	});
	
	//vscode.commands.executeCommand("workbench.extensions.action.installExtension", "codebing");
}