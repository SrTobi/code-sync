import {GenericConfig} from './generic_config'


export interface ConfigProvider {
	getConfigs(mergable:boolean):GenericConfig[];
	getConfig(template:GenericConfig, mergable:boolean):GenericConfig;
	
	save();
}

export function getConfigProvider():ConfigProvider {
	return null;
}