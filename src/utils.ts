import * as fs from 'fs';
import * as path from 'path';
import * as globm from 'glob';

export async function glob(pattern: string, options: globm.IOptions): Promise<string[]> {
    return new Promise<string[]>((resovle, reject) => {
            globm(pattern, options,
                (err, matches) => {
                    if (err) {
                        reject(err);
                    }
                    resovle(matches);
                });
        });
}

export async function readJSON(path: string): Promise<JSON> {
    return new Promise<JSON>((resolve, reject) => {
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
                reject(err);                
            }
            resolve(JSON.parse(data));
        }); 
    });
}

export async function writeJSON(path: string, value: JSON): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(path, JSON.stringify(value), {encoding: 'utf8'} , (err) => {
            if(err) {
                reject(err);
            }
            resolve();
        });
    });
}

export function asPromise<T>(value: T): Promise<T> {
    return new Promise<T>(resolve => {
        resolve(value); 
    });
}
