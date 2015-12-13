import * as path from 'path';

export interface Environment {
	getSettingsPath(): string;
}

class WindowsEnvironment implements Environment {
	getSettingsPath(): string {
		return "%APPDATA%/Code/User/settings.json";
	}
}

export function getEnvironment() {
	if (process.platform === "win32") {
		return new WindowsEnvironment();
	} else {
		throw new Error("Not implemented");
	}
}
