const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getGroup: () => ipcRenderer.invoke('getGroup'),
    setGroup: (groupStudent) => ipcRenderer.send('setGroup', groupStudent),
});
