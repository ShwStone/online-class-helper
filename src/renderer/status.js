const information = document.getElementById('info');
information.textContent = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`;

const fileStatus = document.getElementById('fileStatus');
const classes = document.getElementById('classes');

fileStatus.textContent = 'Excel名单未选择'
fileStatus.style.color = 'red';

let nameList = [];

window.electronAPI.setFile(async (event, classNameList, fileName, classChosen) => {
    fileStatus.textContent = 'Excel名单已选择：' + fileName;
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
