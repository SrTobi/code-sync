import * as vscode from 'vscode';

export interface Monitor
{
    
}

class MonitorImpl implements Monitor
{
    private outputChannel: vscode.OutputChannel;
    public constructor(action: string) {
        this.outputChannel = vscode.window.createOutputChannel(action);
        this.outputChannel.show();
    }
    
    public writeLine(line: string) {
        this.outputChannel.appendLine(line);
    }
}

var globalMonitor: MonitorImpl = null;

export function hasActiveMonitor() {
    return globalMonitor != null;
}

export function aquireMonitor(action: string): Monitor {
    if (globalMonitor) {
         throw new Error("A monitor is currently active!");   
    }
    
    return globalMonitor = new MonitorImpl(action);
}

export function freeMonitor(current: Monitor) {
    if(current != globalMonitor) {
        throw new Error("Wrong monitor!");
    }
    globalMonitor = null;
}

export function log(message: any) {
    if (globalMonitor == null) {
        throw new Error("No monitor opened!");
    }
    console.log(message);
    globalMonitor.writeLine(message);
}
