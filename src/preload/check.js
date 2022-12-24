const { contextBridge, ipcRenderer } = require('electron');

console.log('ok');

contextBridge.exposeInMainWorld('electronAPI', {
    checkStudent: (checkInfo) => ipcRenderer.invoke('checkStudent', checkInfo),
});
