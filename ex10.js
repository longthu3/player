const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const progressSpan = document.querySelector('.dots');
const time = document.getElementById('start');
const playToggle = document.getElementById('play');
const moveSecond = document.getElementById('move-10');
const downSecond = document.getElementById('down-10');
const iTag = playToggle.querySelector('i');
const audio = document.querySelector('#audio');
let totalTime;

let progressBarRect;
let progressBarWidth = progressBar.clientWidth;

audio.addEventListener('loadedmetadata', () => {
    totalTime = audio.duration;
    document.getElementById('end').textContent = changeSecondToTime(totalTime);
});

const updateProgress = (e) => {
    if (!totalTime || isNaN(totalTime)) {
        return;
    }

    const offsetX = e.clientX - progressBarRect.left;
    const rate = Math.max(0, Math.min(100, (offsetX / progressBarWidth) * 100));

    //change with of progress
    progress.style.width = rate + '%';

    //change time
    const newTime = (rate / 100) * totalTime;
    time.textContent = changeSecondToTime(newTime);
    audio.currentTime = newTime;
};

const changeSecondToTime = (second) => {
    const min = Math.floor(second / 60);
    const sec = Math.floor(second % 60);
    return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
}

moveSecond.addEventListener('click', () => {
    let currentTime = audio.currentTime + 10;
    if (currentTime > totalTime) {
        currentTime = totalTime;
    }
    time.textContent = changeSecondToTime(currentTime);
    audio.currentTime = currentTime;
    progress.style.width = (currentTime / totalTime) * 100 + '%'
});

downSecond.addEventListener('click', () => {
    let currentTime = audio.currentTime - 10;
    if (currentTime < 0) {
        currentTime = 0;
    }
    time.textContent = changeSecondToTime(currentTime);
    audio.currentTime = currentTime;
    progress.style.width = (currentTime / totalTime) * 100 + '%';
});

playToggle.addEventListener('click', () => {
    iTag.classList.contains('fa-play') ? iTag.classList.replace('fa-play', 'fa-pause') : iTag.classList.replace('fa-pause', 'fa-play');
    play();
});

audio.addEventListener('timeupdate', () => {
    const currentTime = audio.currentTime;
    const rate = (currentTime / totalTime) * 100;
    time.textContent = changeSecondToTime(currentTime);
    progress.style.width = rate + '%';
});

const play = () => {
    if (iTag.classList.contains('fa-play')) {
        audio.pause();
    } else {
        audio.play();
    }
    const interval = setInterval(() => {
        if (audio.paused) {
            clearInterval(interval);
            return;
        }

        const currentTime = audio.currentTime;
        const rate = (currentTime / totalTime) * 100;
        time.textContent = changeSecondToTime(currentTime);
        audio.currentTime = currentTime;
        time.textContent = changeSecondToTime(currentTime);
        progress.style.width = rate + '%';
        if (currentTime >= totalTime || iTag.classList.contains('fa-play')) {
            clearInterval(interval);
            iTag.classList.replace('fa-pause', 'fa-play');
            progress.style.width = 0 + '%';
            time.textContent = changeSecondToTime(0);
            audio.currentTime = 0;
        }
    }, 1000);
};

progressBar.addEventListener('mousedown', (e) => {
    progressBarRect = progressBar.getBoundingClientRect();
    updateProgress(e);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

const onMouseMove = (e) => {
    updateProgress(e);
};

const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
};

progressSpan.addEventListener('mousedown', (e) => {
    progressBarRect = progressBar.getBoundingClientRect();
    const offsetXSpan = e.clientX - progressBarRect.left;
    const rate = Math.max(0, Math.min(100, (offsetXSpan / progressBarWidth) * 100));
    progress.style.width = rate + '%';

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

progressBar.addEventListener('mousemove', (e) => {
    progressBarRect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - progressBarRect.left;
    const rate = Math.max(0, Math.min(100, (offsetX / progressBarWidth) * 100));

    if (totalTime && !isNaN(totalTime)) {
        const hoverTime = (rate / 100) * totalTime;
        tooltip.textContent = changeSecondToTime(hoverTime);
        tooltip.style.left = `${offsetX}px`;
        tooltip.style.display = 'block';
    }
});

progressBar.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
});
