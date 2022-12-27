const groups = document.getElementById('groups');
let groupStudent = null;

async function main() {
    groupStudent = await window.electronAPI.getGroup();
}

let id = 1;
let dragged = null, fromGroup = null;

main().then(() => {groups.innerHTML = '';
    for (const key of groupStudent.keys()) {
        groups.innerHTML += `第${id}组：<input class='smallentry' value=${key} name='groupName'></br><div id=${key}></div>`;
        const thisGroup = document.getElementById(key);
        thisGroup.addEventListener("dragover", (event) => {
            event.preventDefault();
        });
        thisGroup.addEventListener("drop", (event) => {
            event.preventDefault();
                dragged.parentNode.removeChild(dragged);
                event.target.appendChild(dragged);
                groupStudent.get(fromGroup).delete(dragged.id);
                groupStudent.get(key).add(dragged.id);
        });
        for (const name of groupStudent.get(key).values()) {
            thisGroup.innerHTML += `<div id=${name} draggable=true>${name}</div>`;
            const student = document.getElementById(name);
            student.addEventListener('click', () => {
                // dragged = event.target;
                // fromGroup = key;
                console.log('ok');
            });
            console.log(student);
        }
        id++;
    }
});

