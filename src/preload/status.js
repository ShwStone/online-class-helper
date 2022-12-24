const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('electronAPI', {
    setFile: (callback) => ipcRenderer.on('setFile', callback),
    getClassNameList: () => ipcRenderer.invoke('getClassNameList'),
    changeClass: (className, checked) => ipcRenderer.send('changeClass', className, checked),
});
