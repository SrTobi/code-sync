import {BackupProvider, BackupProviderConfigTemplate} from '../backup_provider';
import {ConfigHandle} from '../config_handle';

class FSBackupProvider implements BackupProvider {
	
	constructor(template: BackupProviderConfigTemplate) {
		
	}
	
	getConfigs(): Promise<ConfigHandle[]> {
		throw new Error("Not implemented");
	}
	
	getConfig(template: ConfigHandle): Promise<ConfigHandle> {
		throw new Error("Not implemented");
	}

	save(): Promise<void> {
		throw new Error("Not implemented");
	}
	
	supportVersioning(): boolean {
		return false;
	}
}
