import {BackupProvider, BackupProviderConfigTemplate} from '../backup_provider';
import {ConfigHandle, FileConfigHandle} from '../config_handle';
import {ConfigProviderTask, ConfigProviderBackend} from '../config_provider';
import * as path from 'path';
import * as utils from '../utils';

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
	
	async getConfigs(): Promise<ConfigHandle[]> {
        let configs: ConfigHandle[] = [];
		let mountpoints = await utils.glob("*/", {cwd: this._basepath});
        for(let mp of mountpoints) {
            mp = mp.replace(/[\/\\]/g, "");
            let p = path.join(this._basepath, mp);
            let files = await utils.glob(path.join(p, "**/*.*"), {cwd: p});
            for(let file of files) {
                configs.push(new FileConfigHandle(file, mp, this, this._backend));
            }
        }
        
        return configs;
	}
	
	getConfig(template: ConfigHandle): Promise<ConfigHandle> {
		return new Promise<ConfigHandle>(resolve => {
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
