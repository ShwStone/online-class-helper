const btn = document.getElementById('btn');
const name = document.getElementById('name');

btn.addEventListener('click', async () => {
    name.textContent = '本次幸运观众是：' + await window.electronAPI.randStudent();
})
