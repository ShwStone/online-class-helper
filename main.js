const path = require('path');
const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron')
const XLSX = require('xlsx');

let className = [];


const creatWindow = () => {
    const win = new BrowserWindow({
        width: 450,
        height: 250,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    const menu = Menu.buildFromTemplate([
        {
            label: '工具',
            submenu: [
            {
                click: () => win.webContents.send('check'),
                label: '签到',
            },
            {
                click: () => win.webContents.send('changeFile'),
                label: '选择班级',
            },
            {
                click: () => {
                    let filePath = dialog.showOpenDialogSync({ properties: ['openFile'] });
                    if (filePath) {
                        let workBook = XLSX.readFile(filePath[0])
                        className = workBook.SheetNames;
                        console.log(workBook.Sheets[className[0]]);
                        // win.webContents.send('changeFile', filePath);
                    }
                },
                label: '选择名单',
            },
            {
                click: () => win.webContents.openDevTools(),
                label: '开发者工具',
            }
            ]
        }
    ])
    Menu.setApplicationMenu(menu)

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
