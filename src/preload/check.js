const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    checkStudent: (checkInfo) => ipcRenderer.invoke('checkStudent', checkInfo),
});
