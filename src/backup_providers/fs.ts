import {BackupProvider, BackupProviderConfigTemplate} from '../backup_provider';
import {ConfigHandle, FileConfigHandle} from '../config_handle';
import {ConfigProviderTask, ConfigProviderBackend} from '../config_provider';
import * as path from 'path';

interface FSBackupProviderConfigTemplate extends BackupProviderConfigTemplate{
	path: string;
}

export class FSBackupProvider implements BackupProvider {
	
	private _basepath: string;
	private _backend = new ConfigProviderBackend();
	
	constructor(template: BackupProviderConfigTemplate) {
		let t = <FSBackupProviderConfigTemplate>(template);
		this._basepath = t.path;
	}
	
	getConfigs(): Promise<ConfigHandle[]> {
		throw new Error("Not implemented");
	}
	
	getConfig(template: ConfigHandle): Promise<ConfigHandle> {
		return new Promise(resolve => {
			let mp = template.mountpoint();
			let name = template.name();
			let filepath = path.join(this._basepath, mp, name);
			let newHandle = new FileConfigHandle(filepath, mp, this, this._backend);
			resolve(newHandle);
		})
	}

	async save() {
		await this._backend.save();
	}
	
	supportVersioning(): boolean {
		return false;
	}
}
