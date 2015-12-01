import {MergeHandler} from './merge';
import * as path from 'path';
import * as fs from 'fs';
import {Readable} from 'stream';
import {ConfigProvider} from './config_provider';

export interface ConfigHandle {
	name(): string;

	date(): Date;
	
	mountpoint(): string;
	
	provider(): ConfigProvider;

	replaceBy(other: ConfigHandle): Promise<void>;
	
	blobStream(): Readable;

	clone(newProvider: ConfigProvider): ConfigHandle;
}


export class FileConfigHandle implements ConfigHandle {
	
	constructor(
		private _path: string,
		private _mountpoint: string,
		private _configProvider: ConfigProvider
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
	
	blobStream(): Readable {
		return fs.createReadStream(this._path);
	}

	async replaceBy(other: ConfigHandle): Promise<void> {
		return new Promise<void>(resolve => {
			other.blobStream().pipe(fs.createWriteStream(this._path));
			resolve();
		});
	}

	clone(newProvider: ConfigProvider): ConfigHandle {
		throw new Error("Not implemented");
	}
}
