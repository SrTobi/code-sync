import {ConfigProvider} from './config_provider';
import {ConfigHandle} from './config_handle';
import * as vscode from 'vscode';


export interface BackupProviderConfigTemplate {
	name: string;
	type: string;
}

export interface BackupProviderFactory {
	new(template: BackupProviderConfigTemplate): BackupProvider;
}

export interface BackupProvider {
	getConfigs(): Promise<ConfigHandle[]>;
	getConfig(template: ConfigHandle): Promise<ConfigHandle>;
    
	save(): Promise<void>;
    
	supportVersioning(): boolean;
}

var GlobalProviderList: { [id: string]: BackupProviderFactory } = {};

export function registerBackupProvider(type: string, factory: BackupProviderFactory): void {
	if (GlobalProviderList[type] !== undefined) {
		throw new Error("Provider '" + type + "' already defined!");
	}
	
	GlobalProviderList[type] = factory;
	console.log("Registered backup provider '" + type + "'.");
}

function createBackupProvider(pt: BackupProviderConfigTemplate): BackupProvider {
	console.log("Create backup provider '" + pt.type + "'...");
	let provider = GlobalProviderList[pt.type];
	if (provider === undefined) {
		throw new Error("Undefined backup provider!");
	}
	
	return new provider(pt);
}

export async function getBackupProvider(): Promise<BackupProvider> {
	let provider: BackupProvider = null;
	let config = vscode.workspace.getConfiguration("codesync") as vscode.WorkspaceConfiguration;
	let providerTemplateList = config.get("backupProviders") as BackupProviderConfigTemplate[];
	
	if (providerTemplateList.length == 0) {
		throw new Error("Not implemented");
		
	} else if (providerTemplateList.length == 1) {
		return new Promise<BackupProvider>(resolve => resolve(createBackupProvider(providerTemplateList[0])));
	} else {
		let pt = await vscode.window.showQuickPick(providerTemplateList.map((pt) => {
			return {
				label: pt.name,
				description: "test",
				providerTemplate: pt
			};
		}));
		
		return createBackupProvider(pt.providerTemplate);
	}
}
