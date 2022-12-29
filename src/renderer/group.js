const groups = document.getElementById('groups');
let groupStudent = null;

async function readGroup() {
    groupStudent = await window.electronAPI.getGroup();
}

function makeHTML() {
    console.log(groupStudent);
    groups.innerHTML = '';
    let id = 1;
    /*
     * 重要提示，以后写代码一定要注意：
     * 在修改 innerHTML 时，自己所有的孩子元素将会全部被重置，先前设置的EventListener将会失效。所以务必先渲染HTML再编写JavaScript.
     * 就这个鬼bug修了我三天
     *
     */
    for (const key of groupStudent.keys()) {
        groups.innerHTML += `第${id}组名称：<input class='smallentry' value=${key} name='groupName' id='entry${key}'>`
        if (key !== '未设置分组的学生') groups.innerHTML += ` <button class='smallbtn' id='remove${key}'>删除</button>`;
        groups.innerHTML += `</br><div id=${key} class='group'></div>`;
        const thisGroup = document.getElementById(key);
        for (const name of groupStudent.get(key).values()) {
            thisGroup.innerHTML += `<div id=${name} draggable='true' class='name'>${name}&nbsp;</div>`;
        }
        if (groupStudent.get(key).size === 0) {
            thisGroup.innerHTML = '</br>';
        }
        id++;
    }
    for (const key of groupStudent.keys()) {
        const entry = document.getElementById(`entry${key}`);
        entry.onkeydown = (event) => {
            if (event.keyCode === 13) {
                let name = event.target.id.substring(5);
                if (groupStudent.has(event.target.value)) {
                    for (const x of groupStudent.get(name).values()) {
                        groupStudent.get(event.target.value).add(x);
                    }
                } else {
                    groupStudent.set(event.target.value, groupStudent.get(name));
                }
                groupStudent.delete(name);
                makeHTML();
            }
        }

        if (key !== '未设置分组的学生') {
            const rmv = document.getElementById(`remove${key}`);
            rmv.addEventListener('click', (event) => {
                let name = event.target.id.substring(6);
                if (groupStudent.get(name).size !== 0) {
                    if (!groupStudent.has('未设置分组的学生')) groupStudent.set('未设置分组的学生', new Set());
                    for (const x of groupStudent.get(name).values()) {
                        groupStudent.get('未设置分组的学生').add(x);
                    }
                }
                groupStudent.delete(name);
                makeHTML();
            });
        }

        const thisGroup = document.getElementById(key);
        thisGroup.addEventListener('dragenter', (event) => {
            if (event.target.className !== 'group') return;
            event.target.style.backgroundColor = 'lightblue';
            event.preventDefault();
        });
        thisGroup.addEventListener("dragover", (event) => {
            if (event.target.className !== 'group') return;
            event.preventDefault();
        });
        thisGroup.addEventListener('dragleave', (event) => {
            if (event.target.className !== 'group') return;
            event.target.style.backgroundColor = 'transparent';
            event.preventDefault();
        });
        thisGroup.addEventListener("drop", (event) => {
            if (event.target.className !== 'group') return;
            event.preventDefault();
            event.target.style.backgroundColor = 'transparent';

            const dragged = document.getElementById(event.dataTransfer.getData('text'));

            groupStudent.get(dragged.parentNode.id).delete(dragged.id);
            groupStudent.get(event.target.id).add(dragged.id);
            if (dragged.parentNode.id === '未设置分组的学生' && groupStudent.get(dragged.parentNode.id).size === 0) {
                groupStudent.delete('未设置分组的学生');
            }

            makeHTML();
        });
        for (const name of groupStudent.get(key).values()) {
            document.getElementById(name).addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text', event.target.id);
            });
        }
    }
}

readGroup().then(makeHTML);

document.getElementById('newgroup').addEventListener('click', (event) => {
    groupStudent.set(`新组${groupStudent.size + 1}`, new Set());
    makeHTML();
});

document.getElementById('save').addEventListener('click', (event) => window.electronAPI.setGroup(groupStudent));
