const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    timeIsUp: () => ipcRenderer.send('timeIsUp'),
});
