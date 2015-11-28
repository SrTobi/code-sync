import {GenericConfig} from './generic_config';
import {ConfigProvider} from './config_provider';

export interface BackupProvider extends ConfigProvider {
	supportVersioning():boolean;
}

export function getBackupProvider():BackupProvider {
	return null;
}