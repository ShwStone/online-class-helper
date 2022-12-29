const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('electronAPI', {
    setFile: (classNameList, fileName, classChosen) => ipcRenderer.on('setFile', classNameList, fileName, classChosen),
    changeClass: (className, checked) => ipcRenderer.send('changeClass', className, checked),
    changeGroup: (groupScore) => ipcRenderer.on('changeGroup', groupScore),
    addScore: (group, score) => ipcRenderer.send('addScore', group, score),
});
