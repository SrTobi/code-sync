import * as path from 'path';

export interface Environment {
	getSettingsPath(): string;
    getKeyBindingPath(): string;
}

class WindowsEnvironment implements Environment {
	getSettingsPath(): string {
		return path.join(process.env.APPDATA, "Code/User/settings.json");
	}
    
    getKeyBindingPath(): string {
        return path.join(process.env.APPDATA, "Code/User/keybindings.json");
    }
    
    getSnippetDir(): string {
        return path.join(process.env.APPDATA, "Code/User/snippets");
    }
}

export function getEnvironment(): Environment {
	if (process.platform === "win32") {
		return new WindowsEnvironment();
	} else {
		throw new Error("Not implemented");
	}
}
