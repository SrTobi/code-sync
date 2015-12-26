import * as vscode from 'vscode';
import * as config_provider from './config_provider';
import * as backup_provider from './backup_provider';
import {aquireMonitor, freeMonitor, log} from './monitor';

export async function backup()
{
    let monitor = aquireMonitor();
	log("Start full backup...");
	let configp = config_provider.getConfigProvider();
	let backupp = await backup_provider.getBackupProvider();
	
	let configs = await configp.getConfigs();
	
	for (var config of configs) {
		let backup = await backupp.getConfig(config);
		backup.replaceBy(config);
	}
	
	await backupp.save();
	
	log("Backup sucessfull!");
    freeMonitor(monitor);
}

export function restore()
{
	/*console.log("Start full restore...");
	let configp = config_provider.getConfigProvider();
	let backupp = backup_provider.getBackupProvider();
	
	backupp.getConfigs(false).forEach(config => {
		let configDest = configp.getConfig(config, false);
		configDest.replaceBy(config);
	});
	
	configp.save();*/
}

export function show()
{
	vscode.commands.getCommands().then((value:string[]) => {
		vscode.window.showQuickPick(value);
	});
	
	//vscode.commands.executeCommand("workbench.extensions.action.installExtension", "codebing");
}
