const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    randStudent: () => ipcRenderer.invoke('randStudent'),
    addScoreStudent: (name, score) => ipcRenderer.send('addScoreStudent', name, score),
});
