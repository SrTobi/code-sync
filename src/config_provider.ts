import {ConfigHandle, FileConfigHandle} from './config_handle';
import * as env from './environment';
import {glob} from  './utils';
import * as path from 'path';


export interface ConfigProvider {
	getConfigs(): Promise<ConfigHandle[]>;
	getConfig(template: ConfigHandle): Promise<ConfigHandle>;

	save(): Promise<void>;
}

export interface ConfigProviderTask {
	execute(id: string): Promise<void>;
}

export class ConfigProviderBackend {
	private _tasks: ConfigProviderTask[] = new Array();
		
	addTask(task: ConfigProviderTask): void {
		this._tasks.push(task);
	}
	
	async save(): Promise<void> {
        let id = 1;
		for(let task of this._tasks) {
			await task.execute(id.toString());
            id++;
		}
	}
}

class ActiveConfigProvider implements ConfigProvider {

	private _backend = new ConfigProviderBackend();
	
	async getConfigs(): Promise<ConfigHandle[]> {
        let snippets = await this.globSnippets();
        
		return new Promise<ConfigHandle[]>(resolve => {
			let configs = new Array<ConfigHandle>();
			
			configs.push(new FileConfigHandle(env.getEnvironment().getSettingsPath(), "user.settings", this, this._backend));
			configs.push(new FileConfigHandle(env.getEnvironment().getKeyBindingPath(), "user.settings", this, this._backend));
            
            for(let snippet of snippets) {
                configs.push(new FileConfigHandle(snippet, "user.snippets", this, this._backend));
            }
			
			resolve(configs);
		});
	}
    
	async getConfig(template: ConfigHandle): Promise<ConfigHandle> {
		throw new Error("Not implemented");
	}

	async save(): Promise<void> {
		throw new Error("Not implemented");
	}
    
    private async globSnippets(): Promise<string[]> {
        let dir = env.getEnvironment().getSnippetDir();
        let files = await glob("*.json", {cwd: dir, nodir: true});
        return files.map(file => path.join(dir, file));
    }
}

export function getConfigProvider(): ConfigProvider {
	return new ActiveConfigProvider();
}
