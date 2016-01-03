import * as vscode from 'vscode';
import * as active_config from './active_config';
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
        
    try {
        log("Start backup...");
        
        let provider = await backup_provider.getBackupProvider();
        let config = await active_config.getActiveConfig();
        
        config.backup(provider);
        
	    log("Backup sucessfull!");
    } catch (error) {
        log("Backup failed [" + error.toString() + "]");
    } finally {
        freeMonitor(monitor);
    }
}

export async function restore()
{
    let monitor = getMonitor("Backup");
    if (!monitor) 
        return;
        
    try {
        log("Start restore...");
        
        let provider = await backup_provider.getBackupProvider();
        let config = await active_config.getActiveConfig();
        
        config.restore(provider);
        
	    log("Restore sucessfull!");
    } catch (error) {
        log("Restore failed [" + error.toString() + "]");
    } finally {
        freeMonitor(monitor);
    }
}

export function show()
{
	vscode.commands.getCommands().then((value:string[]) => {
		vscode.window.showQuickPick(value);
	});
	
	//vscode.commands.executeCommand("workbench.extensions.action.installExtension", "codebing");
}
