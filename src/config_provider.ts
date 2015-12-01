import {ConfigHandle, FileConfigHandle} from './config_handle';
import * as env from './environment';


export interface ConfigProvider {
	getConfigs(): Promise<ConfigHandle[]>;
	getConfig(template: ConfigHandle): Promise<ConfigHandle>;

	save(): Promise<void>;
}

class ActiveConfigProvider implements ConfigProvider {

	async getConfigs(): Promise<ConfigHandle[]> {
		return new Promise<ConfigHandle[]>(resolve => {
			let configs = new Array<ConfigHandle>();
			
			configs.push(new FileConfigHandle(env.getEnvironment().getSettingsPath(), "user.settings", this));
			
			resolve(configs);
		});
	}
	
	async getConfig(template: ConfigHandle): Promise<ConfigHandle> {
		throw new Error("Not implemented");
	}

	async save(): Promise<void> {
		throw new Error("Not implemented");
	}
}

let cprovider = new ActiveConfigProvider();

export function getConfigProvider(): ConfigProvider {
	return cprovider;
}
