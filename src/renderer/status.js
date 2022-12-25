const information = document.getElementById('info');
information.textContent = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`;

const fileStatus = document.getElementById('fileStatus');
const classes = document.getElementById('classes');

fileStatus.textContent = 'Excel名单未选择'
fileStatus.style.color = 'red';

let nameList = [];

window.electronAPI.setFile(async (event, classNameList, fileName) => {
    fileStatus.textContent = 'Excel名单已选择：' + fileName;
    fileStatus.style.color = 'green';
    classNameList.sort();

    let classHTML = "";
    for (let i = 0; i < classNameList.length; i++) {
        classHTML += "<p><input type='checkbox' name='checkBox' value='" + classNameList[i] + "'>" + classNameList[i] + "</p>";
    }
    classes.innerHTML = classHTML;

    let checkBox = document.getElementsByName('checkBox');
    for (let i = 0; i < checkBox.length; i++) {
        checkBox[i].addEventListener('click', () => {
            window.electronAPI.changeClass(checkBox[i].value, checkBox[i].checked);
        })
    }
})
