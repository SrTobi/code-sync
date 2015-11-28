import {MergeHandler} from './merge';

export interface GenericConfig {
	name():string;
	
	date():Date;
	
	replaceBy(settings:GenericConfig):Thenable<void>;
	
	merge(settings:GenericConfig, mergeHandler:MergeHandler):Thenable<void>;
	
	canMerge(settings:GenericConfig):boolean;
	
	clone(destination:string):GenericConfig;
}