import {GenericConfig} from './generic_config'


export interface ConfigProvider {
	getConfigs(mergable: boolean): Promise<GenericConfig[]>;
	getConfig(template: GenericConfig): Promise<GenericConfig>;

	save(): Promise<void>;
}

class ActiveConfigProvider implements ConfigProvider {

	async getConfigs(): Promise<GenericConfig[]> {
		return new Promise<GenericConfig[]>(resolve => {
			resolve(new Array<GenericConfig>());
		});
	}
	
	async getConfig(template: GenericConfig): Promise<GenericConfig> {
		throw new Error("Not implemented");
	}

	async save(): Promise<void> {
		
	}
}

let cprovider = new ActiveConfigProvider();

export function getConfigProvider(): ConfigProvider {
	return cprovider;
}
