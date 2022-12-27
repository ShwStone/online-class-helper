const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getGroup: () => ipcRenderer.invoke('getGroup'),
});
