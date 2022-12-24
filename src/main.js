const path = require('path');
const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron')
const XLSX = require('xlsx');

let className = [];

const creatStatusWindow = () => {
    const win = new BrowserWindow({
        width: 450,
        height: 250,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        show: false,
    });

    const menu = Menu.buildFromTemplate([
    {
        label: app.name,
        submenu: [
        {
            // click: () =>
            label: 'Github',
        },
        {
            click: () => win.webContents.openDevTools(),
            label: '开发者工具',
        }
        ]
    },
    {
        label: '班级',
        submenu: [
        {
            // click: () => win.webContents.send('changeFile'),
            label: '选择班级',
        },
        {
            // click: () => {
            //     let filePath = dialog.showOpenDialogSync({ properties: ['openFile'] });
            //     if (filePath) {
            //         let workBook = XLSX.readFile(filePath[0])
            //         className = workBook.SheetNames;
            //         console.log(workBook.Sheets[className[0]]);
            //         // win.webContents.send('changeFile', filePath);
            //     }
            // },
            label: '选择名单',
        }
        ]
    }
    ])
    Menu.setApplicationMenu(menu)

    win.loadFile('src/html/status.html');

    win.once('ready-to-show', () => {
        win.show()
    })
}

app.whenReady().then(() => {
    creatStatusWindow();

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
