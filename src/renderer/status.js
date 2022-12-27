const information = document.getElementById('info');
information.textContent = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`;

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
        classHTML += `<p><input type='checkbox' name='checkBox'`;
        //大坑，checked设置过就会为true,不管设置了什么值
        if (classChosen.get(name)) {
            classHTML += 'checked=1';
        }
        classHTML += `value='${name}'> ${name} </p>`;
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
    let groupHTML = '';
    let groupScoreList = Array.from(groupScore);
    for (const lst of groupScoreList) {
        groupHTML += `<p>${lst[0]}：${lst[1]}分<button class='btn' name='plus'>+1</button><button class='btn' name='minus'>-1</button></p>`;
    }
    groups.innerHTML = groupHTML;

    let plusButton = document.getElementsByName('plus');
    console.log(plusButton.length);
    for (let i = 0; i < plusButton.length; i++) {
        plusButton[i].addEventListener('click', () => {
            console.log(1);
            window.electronAPI.addScore(groupScoreList[i][0], 1);
        });
        console.log(plusButton[i]);
    }

    let minusButton = document.getElementsByName('minus');
    for (let i = 0; i < minusButton.length; i++) {
        minusButton[i].addEventListener('click', () => {
            window.electronAPI.addScore(groupScoreList[i][0], -1);
        });
    }
});
