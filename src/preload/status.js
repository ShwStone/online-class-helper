const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('electronAPI', {
    setFile: (classNameList, fileName) => ipcRenderer.on('setFile', classNameList, fileName),
    changeClass: (className, checked) => ipcRenderer.send('changeClass', className, checked),
});
