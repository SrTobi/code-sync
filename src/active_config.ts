import {BackupLocation, BackupProvider} from './backup_provider';
import * as vscode from 'vscode';
import * as utils from './utils';
import * as env from './environment';

export interface ActiveConfig {
    backup(provider: BackupProvider): Promise<void>;
    restore(provider: BackupProvider): Promise<void>;
}

enum SyncDirection {
    Ignore,
    Up,
    Down,
    Sync
}

function parseSyncDirection(value: string): SyncDirection {
    let map: {[key:string]: SyncDirection} = {
        "ignore": SyncDirection.Ignore,
        "up": SyncDirection.Up,
        "down": SyncDirection.Down,
        "sync": SyncDirection.Sync
    };
    
    return map[value.toLowerCase()];
}

interface FilterConfig {
    default?: string;
    [setting: string]: string;
}

interface SettingsFilter {
    filter(input: any, direction: SyncDirection): any;
}

type SyncMap =  {[key: string]: SyncDirection}

class SpecificSettingsFilter implements SettingsFilter {
    
    private _default: SyncDirection;
    private _filterList: SyncMap = {};
    
    constructor(name: string, presetFilters: SyncMap = {}) {
        let filters = vscode.workspace.getConfiguration("codesync").get("filters") as { [target: string]: FilterConfig };
        let filter = filters[name] || {};
        
        this._default = parseSyncDirection(filter.default) || SyncDirection.Sync;
        for (let attr in filter) {
            if (attr != "default")
                this._filterList[attr] = parseSyncDirection(filter[attr]) || this._default;
        }
        this._filterList = utils.mergeObjects(this._filterList, presetFilters);
    }
    
    public filter(input: any, direction: SyncDirection): any {
        let result: {[key: string]: any};
        
        for (let attr in input) {
            let lvl = this._filterList[attr] || this._default;
            if (lvl == direction || lvl == SyncDirection.Sync) {
                result[attr] = input[attr];
            }
        }
        
        return result;
    }
}


class ActiveConfigImpl implements ActiveConfig {
    
    private _environment: env.Environment;
    private _settingsFilter: SettingsFilter;
    private _keyshortcutFilter: SettingsFilter;
    
    constructor() {
        this._environment = env.getEnvironment();
        this._settingsFilter = new SpecificSettingsFilter("setting");
        this._keyshortcutFilter = new SpecificSettingsFilter("keyboard");
    }
    
    async backup(provider: BackupProvider): Promise<void> {
        // backup settings
        await this.backupJSON(
            await provider.getSettingsLocation(),
            this._environment.getSettingsPath(),
            this._settingsFilter
        );
        
        // backup shortcuts
        await this.backupJSON(
            await provider.getKeyShortcutLocation(),
            this._environment.getSettingsPath(),
            this._keyshortcutFilter
        );
    }
    
    async restore(provider: BackupProvider): Promise<void> {
        // backup settings
        await this.restoreJSON(
            await provider.getSettingsLocation(),
            this._environment.getSettingsPath(),
            this._settingsFilter
        );
        
        // backup shortcuts
        await this.restoreJSON(
            await provider.getKeyShortcutLocation(),
            this._environment.getSettingsPath(),
            this._keyshortcutFilter
        );
    }
    
    private async backupJSON(location: BackupLocation<JSON>, path: string, filter: SettingsFilter): Promise<void> {
        let oldJson = await location.load(true);
        let loadedJson = await utils.readJSON(path);
        
        // process json
        let filteredJson = filter.filter(loadedJson, SyncDirection.Up);
        let newJson = utils.mergeObjects(oldJson, filteredJson);
        
        // save json
        location.save(newJson);
    }
    
    private async restoreJSON(location: BackupLocation<JSON>, path: string, filter: SettingsFilter): Promise<void> {
        let oldJson = await utils.readJSON(path);
        let loadedJson = await location.load(false);
        
        // process json
        let filteredJson = filter.filter(loadedJson, SyncDirection.Down);
        let newJson = utils.mergeObjects(oldJson, filteredJson);
        
        // save json
        await utils.writeJSON(path, newJson);
    }
}

export function getActiveConfig(): ActiveConfig {
    return new ActiveConfigImpl();
}
