const path = require('path');
const {app, BrowserWindow, Menu, ipcMain, dialog, shell, Tray } = require('electron')
const XLSX = require('xlsx');
const sd = require('silly-datetime');
const fs = require('fs');
const ini = require('ini');

let classChosen = new Map(), studentAttend = new Set();
let groupIndex = new Map(), scoreIndex = new Map(), studentGroup = new Map(), groupScore = new Map(), studentScore = new Map();
let excelFile = null, classSheetMap = new Map(), filePath = null, win = null;
let closeToTray = true;
let config = null;

async function creatSonWindow(father, name, width = undefined, height = undefined) {
    const sonWindow = new BrowserWindow({
        width: width,
        height: height,
        parent: father,
        webPreferences: {
            preload: path.join(__dirname, 'preload/' + name + '.js'),
        },
        show: false,
    });
    const menu = Menu.buildFromTemplate([
    {
        label: app.name,
        submenu: [
        {
            click: () => shell.openExternal('https://github.com/Tianyuan-College/online-class-helper'),
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
        sonWindow.setIcon(path.join(__dirname, '../images/icon.png'));
        sonWindow.show();
    })
}

function parseExcel() {
    classChosen.clear(); studentAttend.clear(); classSheetMap.clear();
    try {
        excelFile = XLSX.readFile(filePath);
        for (const sheetName of excelFile.SheetNames) {
            let sheetAoa = XLSX.utils.sheet_to_json(excelFile.Sheets[sheetName], {header: 1});

            if (sheetAoa[0].indexOf('分数') === -1) {
                sheetAoa[0].push('分数');
                for (let i = 1; i < sheetAoa.length; i++) {
                    sheetAoa[i].push(0);
                }
            }
            if (sheetAoa[0].indexOf('小组') === -1) {
                sheetAoa[0].push('小组');
                for (let i = 1; i < sheetAoa.length; i++) {
                    sheetAoa[i].push('未设置分组的学生');
                }
            }
            groupIndex.set(sheetName, sheetAoa[0].indexOf('小组'));
            scoreIndex.set(sheetName, sheetAoa[0].indexOf('分数'));

            for (const lst of sheetAoa) if (lst[0] !== '姓名') {
                studentAttend.add(lst[0]);
                studentGroup.set(lst[0], String(lst[sheetAoa[0].indexOf('小组')]));
                studentScore.set(lst[0], lst[sheetAoa[0].indexOf('分数')]);
            }
            classSheetMap.set(sheetName, sheetAoa);
            classChosen.set(sheetName, false);
        }
        //关闭已有的子窗口，防止数据混乱
        for (const tmp of BrowserWindow.getAllWindows()) if (tmp.id != win.id) {
            tmp.close();
        }
        //显示文件读取成功
        win.webContents.send('setFile', excelFile.SheetNames, path.basename(filePath), classChosen);
        return false;
    } catch {
        dialog.showMessageBox({message: '意外的文件错误：打开名单时出错'});
        return true;
    }
}

function initIni() {
    let tmpFile = null;
    try {
        tmpFile = fs.readFileSync('./config.ini', 'utf-8');
    } catch {
        fs.writeFileSync('./config.ini', '');
        tmpFile = fs.readFileSync('./config.ini', 'utf-8');
    }
    config = ini.parse(tmpFile);
    //Tray的构建依赖于closeToTray
    if (config.closeToTray !== undefined) {
        closeToTray = config.closeToTray;
    }
}

function writeFiles() {
    for (const sheetName of excelFile.SheetNames) {
        for (let i in classSheetMap.get(sheetName)) {
            let name = classSheetMap.get(sheetName)[i][0];
            if (name !== '姓名') {
                classSheetMap.get(sheetName)[i][groupIndex.get(sheetName)] = studentGroup.get(name);
                classSheetMap.get(sheetName)[i][scoreIndex.get(sheetName)] = studentScore.get(name) + groupScore.get(studentGroup.get(name));
            }
        }
        excelFile.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(classSheetMap.get(sheetName));
    }

    config.classChosen = [];
    if (filePath) {
        let tmp = excelFile.SheetNames;
        tmp.sort();
        for (const name of tmp) {
            config.classChosen.push(classChosen.get(name));
        }
        XLSX.writeFile(excelFile, filePath, {bookType: path.extname(filePath).substring(1)});
    }
    config.closeToTray = closeToTray;
    fs.writeFileSync('./config.ini', ini.stringify(config));
}

const creatStatusWindow = () => {
    win = new BrowserWindow({
        width: 600,
        height: 500,
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
            click: () => shell.openExternal('https://github.com/Tianyuan-College/online-class-helper'),
            label: 'Github',
        },
        {
            click: () => win.webContents.openDevTools(),
            label: '开发者工具',
        }
        ]
    },
    {
        label: '学生',
        submenu: [
        {
            click: async () => {
                const { canceled, filePaths } = await dialog.showOpenDialog({
                    properties: ['openFile'],
                    filters: [{ name: 'Excel文件', extensions: ['xlsx', 'xls', 'ods']}]
                });
                if (!canceled && filePaths[0] != filePath) {
                    if (excelFile) writeFiles();
                    let tPath = filePath;
                    filePath = filePaths[0];
                    config.filePath = filePaths[0];
                    //错误处理
                    if (parseExcel()) {
                        filePath = tPath;
                        config.filePath = tPath;
                    }
                }
            },
            label: '选择学生名单',
        },
        {
            label: '学生分组',
            click: async () => {
                if (excelFile === null) {
                    await dialog.showMessageBox({message: '请先选择学生名单'});
                } else {
                    creatSonWindow(win, 'group', width = 600);
                }
            },
        }
        ]
    },
    {
        label: '课堂',
        submenu: [
        {
            label: '签到',
            click: async () => {
                if (excelFile === null) {
                    await dialog.showMessageBox({message: '请先选择学生名单'});
                } else {
                    creatSonWindow(win, 'check');
                }
            },
        },
        {
            label: '随机点名',
            click: async () => {
                if (excelFile === null) {
                    await dialog.showMessageBox({message: '请先选择学生名单'});
                }
                else {
                    creatSonWindow(win, 'rand-name', 400, 300);
                }
            },
        },
        {
            label: '倒计时',
            click: () => creatSonWindow(win, 'remain-time', 400, 250),
        }
        ]
    }
    ])
    Menu.setApplicationMenu(menu);

    win.loadFile('src/html/status.html');

    win.once('ready-to-show', () => {
        win.show();
        win.setIcon(path.join(__dirname, '../images/icon.png'));

        //initExcelFile
        if (config.filePath) {
            filePath = config.filePath;
            try {
                parseExcel();
                let tmp = excelFile.SheetNames;
                tmp.sort();
                for (const i in tmp) {
                    classChosen.set(tmp[i], config.classChosen[i]);
                }
                win.webContents.send('setFile', excelFile.SheetNames, path.basename(filePath), classChosen);
            } catch {
                filePath = null;
                config.filePath = null;
            }
        }
    });

    //托盘事件
    //也可以监听 app 中的 'will-quit' ，但是那样需要在重新启动的时候新建窗口
    win.on('close', (event) => {
        if (closeToTray) {
            event.preventDefault();
            win.setSkipTaskbar(true);
            win.hide();
        }
    });
}

app.whenReady().then(() => {
    creatStatusWindow();
    initIni();

    let tray = new Tray(path.join(__dirname, '../images/icon.png'));
    tray.setContextMenu(Menu.buildFromTemplate([
    {
        label: '打开',
        click: () => {
            win.show();
            win.setSkipTaskbar(false);
        },
    },
    {
        label: '退出',
        click: () => {
            writeFiles();
            app.exit();
        }
    },
    {
        label: '最小化到托盘',
        type: 'checkbox',
        checked: closeToTray,
        click: () => closeToTray = !closeToTray,
    }
    ]))

    ipcMain.on('changeClass', (event, className, checked) => {
        classChosen.set(className, checked);
        for (const lst of classSheetMap.get(className)) {
            if (lst[0] == '姓名' || lst[groupIndex.get(className)] === '未设置分组的学生') continue;
            if (checked) {
                groupScore.set(String(lst[groupIndex.get(className)]), 0);
            } else {
                groupScore.delete(String(lst[groupIndex.get(className)]));
            }
        }
        win.webContents.send('changeGroup', groupScore);
    });

    ipcMain.handle('randStudent', async (event) => {
        if (studentAttend.size === 0) {
            dialog.showMessageBox({message: '哎呀！没有人在听课！请查看班级是否选择正确，然后尝试重新签到。'});
            return '咕咕咕';
        } else {
            const tmp = Array.from(studentAttend);
            return tmp[Math.floor(tmp.length * Math.random())];
        }
    });

    ipcMain.handle('getGroup', async (event) => {
        let groupStudent = new Map();
        for (const className of classChosen.keys()) if (classChosen.get(className)) {
            let gid = groupIndex.get(className);
            for (const lst of classSheetMap.get(className)) if (lst[0] != '姓名') {
                if (!groupStudent.has(studentGroup.get(lst[0]))) groupStudent.set(studentGroup.get(lst[0]), new Set());
                groupStudent.get(studentGroup.get(lst[0])).add(lst[0]);
            }
        }
        return groupStudent;
    });

    ipcMain.on('setGroup', (event, groupStudent) => {
        groupScore.clear();
        for (const key of groupStudent.keys()) {
            if (key !== '未设置分组的学生') {
                groupScore.set(key, 0);
            }
            for (const name of groupStudent.get(key).values()) {
                studentGroup.set(name, key);
            }
        }
        for (const className of classChosen.keys()) if (classChosen.get(className)) {
            let gid = groupIndex.get(className);
            let tmp = classSheetMap.get(className);
            for (let i in tmp) if (tmp[i][0] != '姓名') {
                tmp[i][gid] = studentGroup.get(tmp[i][0]);
            }
            win.webContents.send('changeGroup', groupScore);
        }
    });

    ipcMain.handle('checkStudent', async (event, checkInfo) => {
        absentList = [];
        for (const className of excelFile.SheetNames) if (classChosen.get(className)) {
            //注意tmp是Map元素的引用
            tmp = classSheetMap.get(className);
            for (let i in tmp) if (tmp[i][0] !== '姓名') {
                if (checkInfo.indexOf(tmp[i][0]) === -1) {
                    studentAttend.delete(tmp[i][0]);
                    tmp[i].push('未到');
                } else {
                    studentAttend.add(tmp[i][0]);
                    tmp[i].push(`发言${checkInfo.match(RegExp(tmp[i][0], 'g')).length}`);
                }
                absentList.push([tmp[i][0], (checkInfo.match(RegExp(tmp[i][0], 'g')) || []).length]);
            } else {
                tmp[i].push(sd.format(new Date(), 'MM-DD HH:mm'));
            }
            excelFile.Sheets[className] = XLSX.utils.aoa_to_sheet(tmp);
        }
        return absentList;
    });

    ipcMain.on('timeIsUp', (event) => {
        dialog.showMessageBox({message: '倒计时结束！'});
    });

    ipcMain.on('addScore', (event, group, score) => {
        groupScore.set(group, groupScore.get(group) + score);
        win.webContents.send('changeGroup', groupScore);
    });
    ipcMain.on('addScoreStudent', (event, name, score) => {
        studentScore.set(name, studentScore.get(name) + score);
        if (studentGroup.get(name) !== '未设置分组的学生') {
            groupScore.set(studentGroup.get(name), groupScore.get(studentGroup.get(name)) + score);
            win.webContents.send('changeGroup', groupScore);
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createStatusWindow();
        }
    });

    app.on('quit', (event, exitCode) => {
        writeFiles();
    });
});
