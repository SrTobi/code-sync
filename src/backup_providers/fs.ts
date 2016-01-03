import {BackupProvider, BackupLocation, BackupProviderConfigTemplate} from '../backup_provider';
import * as path from 'path';
import * as utils from '../utils';

interface FSBackupProviderConfigTemplate extends BackupProviderConfigTemplate{
	path: string;
}

export class FSBackupProvider implements BackupProvider {
	
	private _basepath: string;
	
	constructor(template: BackupProviderConfigTemplate) {
		let t = <FSBackupProviderConfigTemplate>(template);
		this._basepath = t.path;
	}
	

    async getSettingsLocation(): Promise<BackupLocation<JSON>> {
        return null;
    }
    
    async getKeyShortcutLocation(): Promise<BackupLocation<JSON>> {
        return null;
        
    }
    
    async getSnippetsLocations(): Promise<BackupLocation<JSON>[]> {
        return null;
        
    }
}
