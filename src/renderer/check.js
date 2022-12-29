const entry = document.getElementById('entry');
console.log(window.electronAPI)

entry.onkeydown = async (event) => {
    if (event.keyCode === 13) {
        let absentList = await window.electronAPI.checkStudent(entry.value);
        console.log(absentList);
        absentList.sort((a, b) => { return b[1] - a[1]; });
        const result = document.getElementById('result');
        const active = document.getElementById('active');
        let tmpabsent = '以下同学迟到了，已从随机点名名单中删除：</br>';
        let tmpactive = '';
        for (i of absentList) if (i[1]) {
            tmpactive += `${i[0]}：发言${i[1]}次</br>`;
        } else {
            tmpabsent += i[0];
            if (i !== absentList[absentList.length - 1]) {
                tmpabsent += '、';
            }
            else {
                tmpabsent += '。';
            }
        }
        if (tmpabsent === '以下同学迟到了，已从随机点名名单中删除：</br>') {
            tmpabsent = '没有同学迟到。';
        }
        result.innerHTML = tmpabsent;
        active.innerHTML = tmpactive;

        const text = document.getElementById('text');
        text.textContent = '签到结果已经写入Excel表。'
    }
}
