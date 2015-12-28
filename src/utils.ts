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
