import * as vscode from 'vscode';
import * as config_provider from './config_provider';
import * as backup_provider from './backup_provider';

export function backup()
{
	console.log("Start full backup...");
	let configp = config_provider.getConfigProvider();
	let backupp = backup_provider.getBackupProvider();
	
	configp.getConfigs(false).then(
		(configs) => {
			var it = configs.entries();
			
			let processNext = () => {
				if (it.next().done) {
					backupp.save().then(() => {
						console.log("Backup sucessfull!");
					});
					return;
				}
				
				let config = it.next().value[1];
				backupp.getConfig(config, false).then((backup) => {
					backup.replaceBy(config).then(processNext, (reason) => {
						console.log("Failed to backup " + config.name() + " [" + reason + "]");
						processNext();
					});
				}, (reason) => {
					console.log("Failed find backup location for " + config.name() + " [" + reason + "]");
					processNext();
				})
			};
			
			processNext();
		},
		(reason) => {
			console.log("Failed to get config list [" + reason + "]");
		}
	);
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