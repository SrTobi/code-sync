import {GenericConfig} from './generic_config'


export interface ConfigProvider {
	getConfigs(mergable:boolean):Thenable<GenericConfig[]>;
	getConfig(template:GenericConfig, mergable:boolean):Thenable<GenericConfig>;
	
	save():Thenable<void>;
}

export function getConfigProvider():ConfigProvider {
	return null;
}