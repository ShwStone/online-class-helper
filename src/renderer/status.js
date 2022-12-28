const information = document.getElementById('info');
information.innerHTML = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`;

const fileStatus = document.getElementById('fileStatus');
const classes = document.getElementById('classes');
const groups = document.getElementById('groups');

fileStatus.textContent = '学生名单未选择'
fileStatus.style.color = 'red';

let nameList = [];

window.electronAPI.setFile(async (event, classNameList, fileName, classChosen) => {
    fileStatus.textContent = '学生名单已选择：' + fileName;
    fileStatus.style.color = 'green';
    classNameList.sort();

    let classHTML = "";
    for (const name of classNameList) {
        classHTML += `<input type='checkbox' name='checkBox' `;
        //大坑，checked设置过就会为true,不管设置了什么值
        if (classChosen.get(name)) {
            classHTML += 'checked=1';
            window.electronAPI.changeClass(name, true);
        }
        //注意value前面的空格
        classHTML += ` value=${name}> ${name} </br>`;
    }
    classes.innerHTML = classHTML;

    let checkBox = document.getElementsByName('checkBox');
    for (let i = 0; i < checkBox.length; i++) {
        checkBox[i].addEventListener('click', () => {
            window.electronAPI.changeClass(checkBox[i].value, checkBox[i].checked);
        })
    }
})

window.electronAPI.changeGroup(async (event, groupScore) => {
    let groupScoreList = Array.from(groupScore);
    groups.innerHTML = '';
    for (const lst of groupScoreList) {
        groups.innerHTML += `${lst[0]}：${lst[1]}分 <button name='plus' class='smallbtn'>+1</button> <button name='minus' class='smallbtn'>-1</button></br>`;
    }
    if (groups.innerHTML == '') {
        groups.innerHTML = '未设置小组';
    }

    let plusButton = document.getElementsByName('plus');
    for (let i = 0; i < plusButton.length; i++) {
        plusButton[i].addEventListener('click', () => {
            window.electronAPI.addScore(groupScoreList[i][0], 1);
        });
    }

    let minusButton = document.getElementsByName('minus');
    for (let i = 0; i < minusButton.length; i++) {
        minusButton[i].addEventListener('click', () => {
            window.electronAPI.addScore(groupScoreList[i][0], -1);
        });
    }
});
