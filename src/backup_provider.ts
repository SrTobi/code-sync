import {ConfigProvider} from './config_provider';

export interface BackupProvider extends ConfigProvider {
	supportVersioning(): boolean;
}

export function getBackupProvider():BackupProvider {
	throw new Error("Not implemented");
}
