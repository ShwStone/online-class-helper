const information = document.getElementById('info');
information.textContent = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`;

const name = document.getElementById('name');
name.textContent = '请先选择名单';

let nameList = [];

document.getElementById('button').addEventListener("click", () => {
    if (nameList.length !== 0) {
        name.textContent = '本次幸运观众是：' + name_list[Math.floor(Math.random() * nameList.length)];
    }
});

window.electronAPI.check((event) => {
    console.log('hello')
})

window.electronAPI.changeNameList((event, newNameList) => {

})
