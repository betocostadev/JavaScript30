/* Get elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

/* Build functions */
function togglePlay() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    // video[video.paused ? 'play' : 'pause']();
}
function updateButton() {
    const icon = this.paused ? '►' : '❚❚';
    toggle.textContent = icon;
}

function skip() {
  // console.log(this.dataset.skip);
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
//   console.log(this.value);
}

function handleProgress() {
    // Get video time in percentage to apply the flex value in the progress bar
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

// control the progress bar
function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
    console.log(e)
}

/* Hook up the event listeners */
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('play', displayTime);
video.addEventListener('pause', updateButton);
// Handle the progress bar
video.addEventListener('timeupdate', handleProgress);

// buttons
toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
progressBar.addEventListener('change', handleProgress);

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

function displayTime() {
    const time = document.getElementsByClassName('time')[0];
    const totalTime = document.getElementsByClassName('totalTime')[0];
    videoDuration = parseInt(video.duration);
    minutes = Math.floor(videoDuration / 60);
    seconds = videoDuration - minutes * 60;
    currentVideoTime = parseInt(video.currentTime);
    totalTime.innerHTML = (minutes + ':' + seconds);
    time.innerHTML = (currentVideoTime);
    setTimeout(displayTime, 1000);
}

