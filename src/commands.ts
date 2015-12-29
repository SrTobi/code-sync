import * as vscode from 'vscode';
import * as config_provider from './config_provider';
import * as backup_provider from './backup_provider';
import {aquireMonitor, freeMonitor, hasActiveMonitor, log, Monitor} from './monitor';

function getMonitor(action: string): Monitor {
    if (hasActiveMonitor()) {
        return null;
    }
    
    return aquireMonitor(action);
}

export async function backup()
{
    let monitor = getMonitor("Backup");
    if (!monitor) 
        return;
        
	log("Start full backup...");
	let configp = config_provider.getConfigProvider();
	let backupp = await backup_provider.getBackupProvider();
	
	let configs = await configp.getConfigs();
	
	for (var config of configs) {
		let backup = await backupp.getConfig(config);
		backup.replaceBy(config);
	}
	
    log("###########################################");
    log("### Start transfer");
    
	await backupp.save();
	
	log("Backup sucessfull!");
    freeMonitor(monitor);
}

export async function restore()
{
    let monitor = getMonitor("Restore");
    if (!monitor) 
        return;
        
	log("Start full restore...");
	let configp = config_provider.getConfigProvider();
	let backupp = await backup_provider.getBackupProvider();
	
	let backups = await backupp.getConfigs();
	
	for (var backup of backups) {
		let config = await configp.getConfig(backup);
		config.replaceBy(backup);
	}
	
    log("###########################################");
    log("### Start transfer");
    
	await configp.save();
	log("Restore sucessfull!");
    freeMonitor(monitor);
}

export function show()
{
	vscode.commands.getCommands().then((value:string[]) => {
		vscode.window.showQuickPick(value);
	});
	
	//vscode.commands.executeCommand("workbench.extensions.action.installExtension", "codebing");
}
