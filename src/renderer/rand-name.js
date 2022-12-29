const btn = document.getElementById('btn');
const name = document.getElementById('name');
const score = document.getElementById('score');

btn.addEventListener('click', async () => {
    let nextname = await window.electronAPI.randStudent();
    name.textContent = '本次幸运观众是：' + nextname;
    score.innerHTML = `<button class='btn' id='addscore' name='${nextname}'>加分</button> <button class='btn' id='minusscore' name='${nextname}'>扣分</button>`
    document.getElementById('addscore').addEventListener('click', (event) => {
        window.electronAPI.addScoreStudent(event.target.name, 1);
    });
    document.getElementById('minusscore').addEventListener('click', (event) => {
        window.electronAPI.addScoreStudent(event.target.name, -1);
    });
})
