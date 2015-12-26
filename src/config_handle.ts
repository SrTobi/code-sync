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
	
	async execute() {
		let source = await this._source;
		await this.copy(source);
	}
	
	private async copy(source: Readable) {
        await this.createPath();
        
		return new Promise<void>((resolve, reject) => {
			log("Copy " + this._sourceName + " to " + this._target);
			
			var wr = fs.createWriteStream(this._target);
		        source.pipe(wr);
            wr.on('open', () => {
                log("Opended destination file...");
            });
			wr.on('error', (err:any) => {console.log("error:"+ err);});
			wr.on('finish', () => {console.log("finish");});
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
	
	provider(): ConfigProvider {
		return this._configProvider;
	}

	date(): Date {
		throw new Error("Not implemented");
	}
	
	blobStream(): Promise<Readable> {
		return new Promise<Readable>(
			(resolve, reject) => {
				log("Create read stream to '" + this._path + "'...");
				let stream = fs.createReadStream(this._path);
                stream.on("error", reject);
				stream.on("open", resolve);
			});
	}

	replaceBy(other: ConfigHandle): void {
		let task = new FileCopyTask(other.blobStream(), path.join(other.mountpoint(), other.name()), this._path);
		log("Adding file copy task ('" + this.name() + "' -> '" + this.name() + "')...");
		this._configProviderBackend.addTask(task);
	}

	clone(newProvider: ConfigProvider): ConfigHandle {
		throw new Error("Not implemented");
	}
}
