
interface Monitor
{
    
}

class MonitorImpl implements Monitor
{
    
}

var globalMonitor: Monitor = null;

export function hasActiveMonitor() {
    return globalMonitor != null;
}

export function aquireMonitor(): Monitor {
    if (globalMonitor) {
         throw new Error("A monitor is currently active!");   
    }
    
    return globalMonitor = new MonitorImpl();
}

export function freeMonitor(current: Monitor) {
    if(current != globalMonitor) {
        throw new Error("Wrong monitor!");
    }
    globalMonitor = null;
}

export function log(message: any) {
    console.log(message);
}
