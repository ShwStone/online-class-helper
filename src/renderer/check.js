const entry = document.getElementById('entry');
console.log(window.electronAPI)

entry.onkeydown = async (event) => {
    console.log('ok')
    if (event.keyCode === 13) {
        console.log('ok')
        let absentList = await window.electronAPI.checkStudent(entry.value);
        const result = document.getElementById('result');
        let tmpabsent = '以下同学迟到了，已从随机点名名单中删除：';
        for (i of absentList) {
            tmpabsent += i + '、';
        }
        console.log(tmpabsent);
        result.textContent = tmpabsent;
    }

}
