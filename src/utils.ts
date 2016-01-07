import * as fs from 'fs';
import * as path from 'path';
import * as globm from 'glob';
import * as mkdirp from 'mkdirp';

export async function glob(pattern: string, options: globm.IOptions): Promise<string[]> {
    return new Promise<string[]>((resovle, reject) => {
            globm(pattern, options,
                (err, matches) => {
                    if (err) {
                        reject(err);
                    }else{
                        resovle(matches);
                    }
                });
        });
}

export async function createPath(pathToCreate: string): Promise<void> {
    return new Promise<void>(resolve => {
           mkdirp(path.dirname(pathToCreate), resolve); 
        });
}

export async function readJSON(path: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
                reject(err);                
            }else {
                resolve(JSON.parse(data));
            }
        }); 
    });
}

export async function writeJSON(path: string, value: any): Promise<void> {
    await createPath(path);
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(path, JSON.stringify(value), {encoding: 'utf8'} , (err) => {
            if(err) {
                reject(err);
            }else{
                resolve();
            }
        });
    });
}

export function asPromise<T>(value: T): Promise<T> {
    return new Promise<T>(resolve => {
        resolve(value); 
    });
}

export function mergeObjects(lower: any, higher: any): any {
    let result: {[key: string]: any} = {};
    for(let attr in lower) { result[attr] = lower[attr]; }
    for(let attr in higher) { result[attr] = higher[attr]; }
    return result;
}
