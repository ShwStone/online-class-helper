const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    randStudent: () => ipcRenderer.invoke('randStudent'),
});
