const start=document.getElementById('start');
const remain=document.getElementById('remain');
const reset=document.getElementById('reset');
const pause=document.getElementById('pse');
const ctn=document.getElementById('continue');

start.style.display='inline';
reset.style.display='none';
pause.style.display='none';
ctn.style.display='none';

const min = document.getElementById('minute');
const sec = document.getElementById('second');

let tmpHTML = '';
for (let m = 0; m <= 40; m++) {
    tmpHTML += `<option value='${m}'>${m}</option>`;
}
console.log(tmpHTML);
min.innerHTML = tmpHTML;

tmpHTML = '';
for (let s = 0; s <= 59; s++) {
    tmpHTML += `<option value='${s}'>${s}</option>`;
}
sec.innerHTML = tmpHTML;

let timer = null, remainTime = 0;

function countDown() {
    if (remainTime > 0) {
        minutes = Math.floor(remainTime / 60);
        seconds = Math.floor(remainTime % 60);
        remain.textContent = '距离结束还剩' + minutes + '分' + seconds + '秒';
        remain.style.color = 'green';
        remainTime--;
    } else {
        clearInterval(timer);
        remain.textContent = '倒计时已结束';
        remain.style.color = 'red';
        window.electronAPI.timeIsUp();
        start.style.display='none';
        reset.style.display='inline';
        pause.style.display='none';
        ctn.style.display='none';
    }
}

start.addEventListener('click', () => {
    remainTime = parseInt(min.value) * 60 + parseInt(sec.value);
    if (remainTime != 0) {
        start.style.display = 'none';
        pause.style.display = 'inline';
        countDown();
        timer = setInterval(countDown, 1000);
    }
});

pause.addEventListener('click', () => {
    clearInterval(timer);
    pause.style.display = 'none';
    ctn.style.display = 'inline';
    reset.style.display = 'inline';
});

ctn.addEventListener('click', () => {
    pause.style.display = 'inline';
    ctn.style.display = 'none';
    reset.style.display = 'none';
    timer = setInterval(countDown, 1000);
});

reset.addEventListener('click', () => {
    start.style.display='inline';
    reset.style.display='none';
    pause.style.display='none';
    ctn.style.display='none';
    remain.textContent = '';
});
