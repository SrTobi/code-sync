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
	constructor(
		private _tasks: ConfigProviderTask[]
	) {
	}
	
	addTask(task: ConfigProviderTask): void {
		this._tasks.push(task);
	}
}

class ActiveConfigProvider implements ConfigProvider {

	private _tasks: ConfigProviderTask[] = new Array();
	private _backend: ConfigProviderBackend;
	
	constructor() {
		this._backend = new ConfigProviderBackend(this._tasks);
	}
	
	async getConfigs(): Promise<ConfigHandle[]> {
		return new Promise<ConfigHandle[]>(resolve => {
			let configs = new Array<ConfigHandle>();
			
			configs.push(new FileConfigHandle(env.getEnvironment().getSettingsPath(), "user.settings", this, this._backend));
			
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
