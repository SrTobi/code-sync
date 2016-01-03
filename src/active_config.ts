import {BackupLocation, BackupProvider} from './backup_provider';
import * as utils from './utils';
import * as env from './environment';

export interface ActiveConfig {
    backup(provider: BackupProvider): Promise<void>;
    restore(provider: BackupProvider): Promise<void>;
}

class ActiveConfigImpl implements ActiveConfig {
    
    private _environment: env.Environment;
    
    constructor() {
        this._environment = env.getEnvironment();        
    }
    
    async backup(provider: BackupProvider): Promise<void> {
        // backup settings
        await this.backupJSON(
            await provider.getSettingsLocation(),
            this._environment.getSettingsPath()
        );
        
        // backup shortcuts
        await this.backupJSON(
            await provider.getKeyShortcutLocation(),
            this._environment.getSettingsPath()
        );
    }
    
    async restore(provider: BackupProvider): Promise<void> {
        // backup settings
        await this.restoreJSON(
            await provider.getSettingsLocation(),
            this._environment.getSettingsPath()
        );
        
        // backup shortcuts
        await this.restoreJSON(
            await provider.getKeyShortcutLocation(),
            this._environment.getSettingsPath()
        );
    }
    
    async backupJSON(location: BackupLocation<JSON>, path: string): Promise<void> {
        let oldJson = await location.load(true);
        let newJson = await utils.readJSON(path);
        
        // process json
        
        // save json
        location.save(newJson);
    }
    
    async restoreJSON(location: BackupLocation<JSON>, path: string): Promise<void> {
        let oldJson = await utils.readJSON(path);
        let newJson = await location.load(false);
        
        // process json
        
        // save json
        await utils.writeJSON(path, newJson);
    }
}

export function getActiveConfig(): ActiveConfig {
    return new ActiveConfigImpl();
}
