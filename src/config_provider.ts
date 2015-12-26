import {ConfigHandle, FileConfigHandle} from './config_handle';
import * as env from './environment';


export interface ConfigProvider {
	getConfigs(): Promise<ConfigHandle[]>;
	getConfig(template: ConfigHandle): Promise<ConfigHandle>;

	save(): Promise<void>;
}

export interface ConfigProviderTask {
	execute(): void;
}

export class ConfigProviderBackend {
	private _tasks: ConfigProviderTask[] = new Array();
		
	addTask(task: ConfigProviderTask): void {
		this._tasks.push(task);
	}
	
	async save(): Promise<void> {
		for(let task of this._tasks) {
			await task.execute();
		}
	}
}

class ActiveConfigProvider implements ConfigProvider {

	private _backend = new ConfigProviderBackend();
	
	async getConfigs(): Promise<ConfigHandle[]> {
		return new Promise<ConfigHandle[]>(resolve => {
			let configs = new Array<ConfigHandle>();
			
			configs.push(new FileConfigHandle(env.getEnvironment().getSettingsPath(), "user.settings", this, this._backend));
			configs.push(new FileConfigHandle(env.getEnvironment().getKeyBindingPath(), "user.settings", this, this._backend));
			
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

export function getConfigProvider(): ConfigProvider {
	return new ActiveConfigProvider();
}
