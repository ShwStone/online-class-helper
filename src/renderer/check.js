const entry = document.getElementById('entry');
console.log(window.electronAPI)

entry.onkeydown = async (event) => {
    console.log('ok')
    if (event.keyCode === 13) {
        console.log('ok')
        let absentList = await window.electronAPI.checkStudent(entry.value);
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
    }

}
