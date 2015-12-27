import {MergeHandler} from './merge';
import * as path from 'path';
import * as fs from 'fs';
import {Readable} from 'stream';
import {ConfigProvider, ConfigProviderBackend, ConfigProviderTask} from './config_provider';
import * as mkdirp from 'mkdirp';
import {log} from './monitor';


export interface ConfigHandle {
	name(): string;

	date(): Date;
	
	mountpoint(): string;
    
    path(): string;
	
	provider(): ConfigProvider;

	replaceBy(other: ConfigHandle): void;
	
	blobStream(): Promise<Readable>;

	clone(newProvider: ConfigProvider): ConfigHandle;
}

class FileCopyTask implements ConfigProviderTask {
	
	constructor(
		private _source: Promise<Readable>,
		private _sourceName: string,
		private _target: string
	) {
	}
	
	async execute(id: string) {
		let source = await this._source;
		await this.copy(source, id);
	}
	
	private async copy(source: Readable, id: string) {
        await this.createPath();
        
		return new Promise<void>((resolve, reject) => {			
			var wr = fs.createWriteStream(this._target);
		    source.pipe(wr);
            wr.on('open', () => {
                log(id + ": Destination opened: " + this._target);
			    log(id + ": Copy " + this._sourceName + " to " + this._target);
            });
			wr.on('error', reject);
			wr.on('finish', () => {log(id + ": Job finished!"); resolve(); });
		});
	}
    
    private async createPath() {
        return new Promise<void>(resolve => {
           mkdirp(path.dirname(this._target), resolve); 
        });
    }
}   


export class FileConfigHandle implements ConfigHandle {
	
	constructor(
		private _path: string,
		private _mountpoint: string,
		private _configProvider: ConfigProvider,
		private _configProviderBackend: ConfigProviderBackend
	) {
	}
	
	name(): string {
		return path.basename(this._path);
	}
	
	mountpoint(): string {
		return this._mountpoint;
	}
    
    path(): string {
        return this._path;
    }
	
	provider(): ConfigProvider {
		return this._configProvider;
	}

	date(): Date {
		throw new Error("Not implemented");
	}
	
	blobStream(): Promise<Readable> {
		return new Promise<Readable>(
			(resolve, reject) => {
				let stream = fs.createReadStream(this._path);
                stream.on("error", reject);
				stream.on("open", () => {
                    log("Source opened[" + this.name() + "]: " + this._path);
                    resolve(stream);
                });
			});
	}

	replaceBy(other: ConfigHandle): void {
		let task = new FileCopyTask(other.blobStream(), path.join(other.mountpoint(), other.name()), this._path);
		log("Adding file copy task ('" + other.path() + "' -> '" + this.path() + "')...");
		this._configProviderBackend.addTask(task);
	}

	clone(newProvider: ConfigProvider): ConfigHandle {
		throw new Error("Not implemented");
	}
}
