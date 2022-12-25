const path = require('path');
const {app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron')
const XLSX = require('xlsx');

global.classChosen = new Map();
global.studentAttend = new Map();
global.classStudentMap = new Map();

global.excelFile = null;
global.classSheetMap = new Map();
global.filePath = null;

async function creatSonWindow(father, name) {
    const sonWindow = new BrowserWindow({
        parent: father,
        webPreferences: {
            preload: path.join(__dirname, 'preload/' + name + '.js'),
        },
        show: false,
    });
    const menu = Menu.buildFromTemplate([
    {
        label: name,
        submenu: [
        {
            click: () => shell.openExternal('https://github.com/ShwStone/onlineClassHelper'),
            label: 'Github',
        },
        {
            click: () => sonWindow.webContents.openDevTools(),
            label: '开发者工具',
        }
        ]
    }
    ]);
    sonWindow.setMenu(menu);
    sonWindow.loadFile('src/html/' + name + '.html');
    sonWindow.once('ready-to-show', () => {
        sonWindow.show();
    })
}

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
                    filters: [{ name: 'Excel文件', extensions: ['xlsx', 'xls', 'ods']}]
                });
                if (!canceled) {
                    global.classChosen.clear(); global.studentAttend.clear(); global.classStudentMap.clear(); global.classSheetMap.clear();
                    global.excelFile = XLSX.readFile(filePaths[0]); global.filePath = filePaths[0];
                    //显示文件读取成功
                    win.webContents.send('setFile', global.excelFile.SheetNames, path.basename(filePaths[0]));

                    for (let sheetName of global.excelFile.SheetNames) {
                        let sheetAoa = XLSX.utils.sheet_to_json(global.excelFile.Sheets[sheetName], {header: 1});
                        global.classSheetMap.set(sheetName, sheetAoa);
                        let tmpStudent = [];
                        for (const lst of sheetAoa) {
                            if (lst[0] !== '姓名') {
                                global.studentAttend.set(lst[0], true);
                                tmpStudent.push(lst[0]);
                            }
                        }
                        console.log(tmpStudent);
                        global.classStudentMap.set(sheetName, tmpStudent);
                        global.classChosen.set(sheetName, false);
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
                if (global.excelFile === null) {
                    await dialog.showMessageBox({message: '请先选择Excel名单'});
                }
                else {
                    creatSonWindow(win, 'check');
                }
            },
        },
        {
            label: '随机点名',
            click: async () => {
                if (global.excelFile === null) {
                    await dialog.showMessageBox({message: '请先选择Excel名单'});
                }
                else {
                    creatSonWindow(win, 'rand-name');
                }
            },
        }
        ]
    }
    ])
    Menu.setApplicationMenu(menu);

    win.loadFile('src/html/status.html');

    win.once('ready-to-show', () => {
        win.show()
    })
}

app.whenReady().then(() => {
    creatStatusWindow();

    ipcMain.on('changeClass', (event, className, checked) => {
        global.classChosen.set(className, checked);
    });

    ipcMain.handle('checkStudent', async (event, checkInfo) => {
        absentList = [];
        for (const className of global.excelFile.SheetNames) {
            if (global.classChosen.get(className)) {
                for (const student of classStudentMap.get(className)) {
                    if (checkInfo.indexOf(student) === -1) {
                        global.studentAttend.set(student, false);
                        absentList.push(student);
                    }
                    else {
                        global.studentAttend.set(student, true);
                    }
                }
            }
        }
        return absentList;
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createStatusWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
