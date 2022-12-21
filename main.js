console.log(`欢迎来到 Electron`)
const path = require('path');

const { app, BrowserWindow } = require('electron')
const creatWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height:600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    win.loadFile('index.html');
}

app.whenReady().then(() => {
    creatWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
