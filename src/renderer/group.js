const groups = document.getElementById('groups');
let groupStudent = null;

async function readGroup() {
    groupStudent = await window.electronAPI.getGroup();
}

function makeHTML() {
    groups.innerHTML = '';
    let id = 1;
    /*
     * 重要提示，以后写代码一定要注意：
     * 在修改 innerHTML 时，自己所有的孩子元素将会全部被重置，先前设置的EventListener将会失效。所以务必先渲染HTML再编写JavaScript.
     * 就这个鬼bug修了我三天
     *
     */
    for (const key of groupStudent.keys()) {
        groups.innerHTML += `第${id}组名称：<input class='smallentry' value=${key} name='groupName'> <button class='smallbtn' name='removegroup'>删除</button></br><div id=${key} class='group'></div>`;
        const thisGroup = document.getElementById(key);
        for (const name of groupStudent.get(key).values()) {
            thisGroup.innerHTML += `<div id=${name} draggable='true' class='name'>${name}&nbsp;</div>`;
        }
        id++;
    }
    for (const key of groupStudent.keys()) {
        const thisGroup = document.getElementById(key);
        thisGroup.addEventListener('dragenter', (event) => {
            event.target.style.backgroundColor = 'lightblue';
            event.preventDefault();
        });
        thisGroup.addEventListener("dragover", (event) => {
            event.preventDefault();
        });
        thisGroup.addEventListener('dragleave', (event) => {
            event.target.style.backgroundColor = 'transparent';
            event.preventDefault();
        });
        thisGroup.addEventListener("drop", (event) => {
            event.preventDefault();
            event.target.style.backgroundColor = 'transparent';
            const dragged = document.getElementById(event.dataTransfer.getData('text'));
            console.log(groupStudent);

            groupStudent.get(dragged.parentNode.id).delete(dragged.id);
            groupStudent.get(event.target.id).add(dragged.id);

            dragged.parentNode.removeChild(dragged);
            event.target.appendChild(dragged);
        });
        for (const name of groupStudent.get(key).values()) {
            document.getElementById(name).addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text', event.target.id);
            });
        }
    }
}

readGroup().then(makeHTML);
