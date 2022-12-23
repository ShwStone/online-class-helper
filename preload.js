const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('electronAPI', {
    check: (callback) => ipcRenderer.on('check', callback),
    chooseClass: (callback) => ipcRenderer.on('changeNameList', callback)
})
