import {BackupLocation, BackupProvider} from './backup_provider';

export interface ActiveConfig {
    backup(provider: BackupProvider): Promise<void>;
    restore(provider: BackupProvider): Promise<void>;
}

class ActiveConfigImpl implements ActiveConfig {
    
    constructor() {
        
    }
    
    async backup(provider: BackupProvider): Promise<void> {
        
    }
    
    async restore(provider: BackupProvider): Promise<void> {
        
    }
}

export function getActiveConfig(): ActiveConfig {
    return new ActiveConfigImpl();
}
