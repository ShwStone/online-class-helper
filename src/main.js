const path = require('path');
const {app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron')
const XLSX = require('xlsx');

global.classNameList = [];
global.studentNameMap = new Map();
global.chosen = new Map();
global.attend = new Map();

const creatStatusWindow = () => {
    const win = new BrowserWindow({
        // width: 450,
        // height: 250,
        webPreferences: {
            preload: path.join(__dirname, 'preload/status.js'),
        },
        show: false,
    });

    const menu = Menu.buildFromTemplate([
    {
        label: app.name,
        submenu: [
        {
            click: () => shell.openExternal('https://github.com/ShwStone/onlineClassHelper'),
            label: 'Github',
        },
        {
            click: () => win.webContents.openDevTools(),
            label: '开发者工具',
        }
        ]
    },
    {
        label: '名单',
        submenu: [
        {
            click: async () => {
                let { canceled, filePaths } = await dialog.showOpenDialog({
                    properties: ['openFile'],
                    filters: [{ name: 'Excel文件', extensions: ['xlsx']}]
                });
                if (!canceled) {
                    global.studentNameMap.clear();
                    global.chosen.clear();
                    global.attend.clear();

                    let workBook = XLSX.readFile(filePaths[0]);

                    global.classNameList = workBook.SheetNames;
                    global.classNameList.sort();

                    //显示文件读取成功
                    win.webContents.send('setFile');

                    for (let i = 0; i < workBook.SheetNames.length; i++) {
                        let sheet = workBook.Sheets[workBook.SheetNames[i]];
                        tmpStudent = [];
                        for (let key in sheet) {
                            if (key[0] !== '!') {
                                tmpStudent.push(sheet[key].v);
                                global.attend.set(sheet[key].v, true);
                            }
                        }
                        global.studentNameMap.set(workBook.SheetNames[i], tmpStudent);
                        global.chosen.set(workBook.SheetNames[i], false);
                    }
                }
            },
            label: '选择名单',
        }
        ]
    },
    {
        label: '功能',
        submenu: [
        {
            label: '签到',
            click: async () => {
                const randNameWindow = new BrowserWindow({
                    parent: win,
                    webPreferences: {
                        preload: path.join(__dirname, 'preload/check.js'),
                    },
                    show: false,

                })
                randNameWindow.loadFile('src/html/check.html');
                randNameWindow.once('ready-to-show', () => {
                    randNameWindow.show();
                    randNameWindow.webContents.openDevTools();
                })
            },
        },
        {
            label: '随机点名',
            click: async () => {
                const randNameWindow = new BrowserWindow({
                    parent: win,
                    webPreferences: {
                        preload: path.join(__dirname, 'preload/rand-name.js'),
                    },
                    show: false,

                })
                randNameWindow.loadFile('src/html/rand-name.html');
                randNameWindow.once('ready-to-show', () => {
                    randNameWindow.show();
                })
            },
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

    ipcMain.handle('getClassNameList', async (event) => {
        return global.classNameList;
    });

    ipcMain.on('changeClass', (event, className, checked) => {
        global.chosen.set(className, checked);
    });

    ipcMain.handle('checkStudent', async (event, checkInfo) => {
        absentList = [];
        // console.log(classNameList);
        // console.log(studentNameMap);
        for (className of global.classNameList) {
            // console.log(className);
            if (chosen.get(className)) {
                for (student of global.studentNameMap.get(className)) {
                    // console.log(student);
                    if (checkInfo.indexOf(student) === -1) {
                        attend.set(student, false);
                        absentList.push(student);
                    }
                    else {
                        attend.set(student, true);
                    }
                }
            }
        }
        console.log(absentList);
        return absentList;
    });

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
