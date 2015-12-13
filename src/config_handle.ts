import {MergeHandler} from './merge';
import * as path from 'path';
import * as fs from 'fs';
import {Readable} from 'stream';
import {ConfigProvider, ConfigProviderBackend, ConfigProviderTask} from './config_provider';

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
		private _target: string
	) {
	}
	
	async execute(): Promise<void> {
		let source = await this._source;
		
		source.pipe(fs.createWriteStream(this._target));
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
			(resolve) => {
				console.log("Create read stream to '" + this._path + "'...");
				let stream = fs.createReadStream(this._path);
				resolve(stream);
			});
	}

	replaceBy(other: ConfigHandle): void {
		let task = new FileCopyTask(other.blobStream(), this._path);
		console.log("Adding file copy task ('" + this.name() + "' -> '" + this.name() + "')...");
		this._configProviderBackend.addTask(task);
	}

	clone(newProvider: ConfigProvider): ConfigHandle {
		throw new Error("Not implemented");
	}
}
