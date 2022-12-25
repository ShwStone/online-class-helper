const entry = document.getElementById('entry');
console.log(window.electronAPI)

entry.onkeydown = async (event) => {
    if (event.keyCode === 13) {
        const absentList = await window.electronAPI.checkStudent(entry.value);
        const result = document.getElementById('result');
        if (absentList.length !== 0) {
            let tmpabsent = '以下同学迟到了，已从随机点名名单中删除：</br>';
            for (i of absentList) {
                tmpabsent += i;
                if (i !== absentList[absentList.length - 1]) {
                    tmpabsent += '、';
                }
                else {
                    tmpabsent += '。';
                }
            }
            result.innerHTML = tmpabsent;
        }
        else {
            result.innerHTML = '没有同学迟到。';
        }
        const text = document.getElementById('text');
        text.textContent = '签到结果已经写入Excel表。'
    }
}