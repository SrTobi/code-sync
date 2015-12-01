import {MergeHandler} from './merge';

export interface GenericConfig {
	name(): string;

	date(): Date;

	replaceBy(settings: GenericConfig): Promise<void>;

	clone(destination: string): GenericConfig;
}
