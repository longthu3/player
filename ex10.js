const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const progressSpan = document.querySelector('.dots');
const time = document.getElementById('start');
const playToggle = document.getElementById('play');
const moveSecond = document.getElementById('move-10');
const downSecond = document.getElementById('down-10');
const iTag = playToggle.querySelector('i');
const audio = document.querySelector('#audio');
const lyricsDiv = document.getElementById('lyrics');

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
    updateLyrics(newTime);
};

const changeSecondToTime = (second) => {
    const min = Math.floor(second / 60);
    const sec = Math.floor(second % 60);
    return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
}

const lyrics = [
    { time: 0, text: "" },
    { time: 16, text: "Feel like sun on my skin" },
    { time: 21, text: "So this is love, I know it is" },
    { time: 25, text: "I know I sound super cliché" },
    { time: 27, text: "But you make me feel some type of way" },
    { time: 29, text: "This is falling, falling in love" },
    { time: 34, text: "Yeah" },
    { time: 40, text: "Ooh, yeah" },
    { time: 41, text: "I got a lot on my mind" },
    { time: 43, text: "Got some more on my plate" },
    { time: 45, text: "My baby got me looking forward to the end of the day" },
    { time: 48, text: "What you say? You and me?" },
    { time: 52, text: "Just forget about the past, throw it in the trash" },
    { time: 56, text: "What you say? You and me?" },
    { time: 60, text: "Live the life we never had, like we're never going back" },
    { time: 67, text: "Feel like sun on my skin" },
    { time: 72, text: "So this is love, I know it is" },
    { time: 76, text: "I know I sound super cliché" },
    { time: 78, text: "But you make me feel some type of way" },
    { time: 80, text: "This is falling, falling in love" },
    { time: 85, text: "I know I sound super cliché" },
    { time: 87, text: "But you make me feel some type of way" },
    { time: 89, text: "This is falling, falling in love..." },
    { time: 96, text: "Yeah" },
    { time: 98, text: "This is falling, falling in love" },
    { time: 102, text: "Ooh..." },
    { time: 107, text: "This is falling, falling in love" }
];

const updateLyrics = (currentTime) => {
    let currentLyric = lyrics[0].text;
    for (let i = 0; i < lyrics.length; i++) {
        if (currentTime >= lyrics[i].time) {
            currentLyric = lyrics[i].text;
        } else {
            break;
        }
    }
    lyricsDiv.textContent = currentLyric;
};

moveSecond.addEventListener('click', () => {
    let currentTime = audio.currentTime + 10;
    if (currentTime > totalTime) {
        currentTime = totalTime;
    }
    time.textContent = changeSecondToTime(currentTime);
    audio.currentTime = currentTime;
    progress.style.width = (currentTime / totalTime) * 100 + '%';
    updateLyrics(currentTime);
});

downSecond.addEventListener('click', () => {
    let currentTime = audio.currentTime - 10;
    if (currentTime < 0) {
        currentTime = 0;
    }
    time.textContent = changeSecondToTime(currentTime);
    audio.currentTime = currentTime;
    progress.style.width = (currentTime / totalTime) * 100 + '%';
    updateLyrics(currentTime);
});

audio.addEventListener('timeupdate', () => {
    const currentTime = audio.currentTime;
    const rate = (currentTime / totalTime) * 100;
    time.textContent = changeSecondToTime(currentTime);
    progress.style.width = rate + '%';
    updateLyrics(currentTime);
    if (rate === 100) {
        iTag.classList.replace('fa-pause', 'fa-play');
        progress.style.width = 0 + '%';
        audio.currentTime = 0;
    }
});

playToggle.addEventListener('click', () => {
    if (iTag.classList.contains('fa-play')) {
        iTag.classList.replace('fa-play', 'fa-pause');
        audio.play();
    } else {
        iTag.classList.replace('fa-pause', 'fa-play');
        audio.pause();
    }
});

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
