import {BackupProvider, BackupLocation, BackupProviderConfigTemplate} from '../backup_provider';
import * as path from 'path';
import * as utils from '../utils';

interface FSBackupProviderConfigTemplate extends BackupProviderConfigTemplate{
	path: string;
}

class JSONLocation implements BackupLocation<any> {
    _path: string;
    
    constructor(path: string) {
        this._path = path;
    }
    
    async load(preload: boolean): Promise<any> {
        try {
            return await utils.readJSON(this._path);
        }catch(error) {
            if(preload) {
                return {};
            }
            throw error;
        }
    }
    
    async save(newValue: any): Promise<void> {
        return await utils.writeJSON(this._path, newValue);
    }
}

export class FSBackupProvider implements BackupProvider {
	
	private _basepath: string;
	
	constructor(template: BackupProviderConfigTemplate) {
		let t = <FSBackupProviderConfigTemplate>(template);
		this._basepath = t.path;
	}
	

    async getSettingsLocation(): Promise<BackupLocation<any>> {
        return utils.asPromise(new JSONLocation(path.join(this._basepath, "settings.json")));
    }
    
    async getKeyShortcutLocation(): Promise<BackupLocation<any>> {
        return utils.asPromise(new JSONLocation(path.join(this._basepath, "keyshortcuts.json")));
    }
    
    async getSnippetsLocations(): Promise<BackupLocation<any>[]> {
        throw new Error("Not implemented!");
    }
}
