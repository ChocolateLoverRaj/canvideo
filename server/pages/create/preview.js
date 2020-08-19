import { Video } from "/common/video/video.js";
import zeroPad from "/common/lib/zero-pad.js";

var canvasContainer;
var canvas;
var ctx;

var previewErrorsDiv;
var PreviewErrors = {};

var previewProgressBackground;
var previewProgressFill;
var previewProgressTimeDone;
var previewProgressTotalTime;

var previewToStart;
var previewPlayPauseCheckbox;
var previewToEnd;
var loopInput;

function progressClickListener(e) {
    if (videoPlayer) {
        let atFraction = (e.x - 10) / (previewProgressBackground.offsetWidth);
        moveTo(video.duration * atFraction);
    }
}

function toStartListener(e) {
    if (video) {
        moveTo(0);
    }
}

function pause() {
    previewPlayPauseCheckbox.checked = false;
    playing = false;
    cancelAnimationFrame(renderAnimationFrame);
}

function playPauseListener(e) {
    if (video) {
        if (playing) {
            pause();
        }
        else {
            playing = true;
            if (donePlaying) {
                donePlaying = false;
                videoPlayer.at = 0;
            }
            lastRendered = Date.now();
            renderAnimationFrame = requestAnimationFrame(renderNextFrame);
        }
    }
}

function toEndListener(e) {
    if (video) {
        moveTo(video.duration);
    }
}

function loopInputListener(e) {
    looping = !looping;
}

export const init = () => {
    canvasContainer = document.getElementById("preview__canvas-container");
    canvas = document.getElementById("preview__canvas");
    ctx = canvas.getContext('2d');
    window.ctx = ctx;

    previewErrorsDiv = document.getElementById("preview__errors");
    PreviewErrors.BAD_JSON = document.getElementById("preview__errors__bad-json");
    PreviewErrors.INVALID_VIDEO = document.getElementById("preview__errors__invalid-video");
    PreviewErrors.NO_DURATION = document.getElementById("preview__errors__no-duration");

    previewProgressBackground = document.getElementById("preview__progress__background");
    previewProgressBackground.addEventListener('click', progressClickListener);
    previewProgressFill = document.getElementById("preview__progress__fill");
    previewProgressFill.addEventListener('click', progressClickListener);
    previewProgressTimeDone = document.getElementById("preview__progress__time-done");
    previewProgressTotalTime = document.getElementById("preview__progress__total-time");

    previewToStart = document.getElementById("preview__controls__beginning");
    previewToStart.addEventListener('click', toStartListener);
    previewPlayPauseCheckbox = document.getElementById("preview__controls__play-pause-checkbox");
    previewPlayPauseCheckbox.addEventListener('change', playPauseListener);
    previewToEnd = document.getElementById("preview__controls__ending");
    previewToEnd.addEventListener('click', toEndListener);
    loopInput = document.getElementById("preview__controls__loop-checkbox");
    loopInput.addEventListener('change', loopInputListener);
};

const showError = errElem => {
    if (videoPlayer) {
        videoPlayer.at = 0;
    }
    playing = false;
    previewPlayPauseCheckbox.checked = false;
    cancelAnimationFrame(renderAnimationFrame);
    previewProgressFill.style.width = "0%";
    previewProgressTimeDone.innerText = formatTime(0);
    previewProgressTotalTime.innerText = formatTime(0);

    previewPlayPauseCheckbox.classList.add("bad");
    canvasContainer.classList.add("hidden");
    previewErrorsDiv.classList.remove("hidden");
    for (let k in PreviewErrors) {
        let v = PreviewErrors[k];
        v.classList.add("hidden");
    }
    errElem.classList.remove("hidden");
};

const noErrors = () => {
    for (let k in PreviewErrors) {
        let v = PreviewErrors[k];
        v.classList.add("hidden");
    }
    previewErrorsDiv.classList.add("hidden");
    canvasContainer.classList.remove("hidden");
    previewPlayPauseCheckbox.classList.remove("bad");
};

const formatTime = s => {
    s = Math.floor(s);
    let m = Math.floor(s / 60);
    s %= 60;
    let h = Math.floor(m / 60);
    m %= 60;
    return (h ? `${h}:` : '') + zeroPad(m, 2) + ":" + zeroPad(s, 2);
};

var video;
var videoPlayer;
var renderAnimationFrame;
var lastRendered = -Infinity;
var playing = false;
var donePlaying = false;
var looping = false;
var canvasWidth;
var canvasHeight;

const moveTo = time => {
    if (time < videoPlayer.duration - video.spf) {
        donePlaying = false;

        previewProgressFill.style.width = `${time * 100 / videoPlayer.duration}%`;
        previewProgressTimeDone.innerText = formatTime(time);
    }
    else {
        time = videoPlayer.duration - video.spf;
        donePlaying = true;

        pause();

        previewProgressFill.style.width = `100%`;
        previewProgressTimeDone.innerText = formatTime(videoPlayer.duration);
    }

    videoPlayer.seek(time);
    videoPlayer.draw(ctx);
}

const renderNextFrame = () => {
    let dateNow = Date.now();
    let timeForward = (dateNow - lastRendered) / 1000;
    lastRendered = dateNow;
    if (videoPlayer.at + timeForward < videoPlayer.duration - video.spf) {
        renderAnimationFrame = requestAnimationFrame(renderNextFrame);

        videoPlayer.forward(timeForward);
        previewProgressFill.style.width = `${videoPlayer.at * 100 / videoPlayer.duration}%`;
        previewProgressTimeDone.innerText = formatTime(videoPlayer.at);
    }
    else {
        if (looping) {
            moveTo(0);
            renderAnimationFrame = requestAnimationFrame(renderNextFrame);
        }
        else {
            playing = false;
            donePlaying = true;
            previewPlayPauseCheckbox.checked = false;

            videoPlayer.forward(videoPlayer.duration - video.spf - videoPlayer.at);
            previewProgressFill.style.width = `100%`;
            previewProgressTimeDone.innerText = formatTime(videoPlayer.duration);
        }
    }

    videoPlayer.draw(ctx);
};

export const updateVideo = text => {
    let videoJson;
    let goodJson = true;
    try {
        videoJson = JSON.parse(text);
    }
    catch{
        showError(PreviewErrors.BAD_JSON);
        goodJson = false;
        video = false;
    }
    if (goodJson) {
        video = Video.fromJson(videoJson, false, false);
        if (video && video.duration > 0) {
            noErrors();

            if (video.width !== canvasWidth || video.height !== canvasHeight) {
                var width, height;
                if (video.width * 9 > video.height * 16) {
                    width = 100;
                    height = (video.height * 100 * 16) / (video.width * 9);
                }
                else {
                    width = (video.width * 100 * 9) / (video.height * 16);
                    height = 100;
                }
                canvas.style.height = `${height}%`;
                canvas.style.width = `${width}%`;
                canvas.style.left = canvas.style.right = `${(100 - width) / 2}%`;
                canvas.style.top = canvas.style.bottom = `${(100 - height) / 2}%`;

                canvas.width = video.width;
                canvas.height = video.height;
            }

            let atBefore = videoPlayer?.at;
            videoPlayer = video.createPlayer();
            if (atBefore > 0 && atBefore < video.duration) {
                moveTo(atBefore);
            }
            else {
                donePlaying = false;
                previewProgressFill.style.width = "0%";
                previewProgressTimeDone.innerText = formatTime(0);
                previewProgressTotalTime.innerText = formatTime(video.duration);
                videoPlayer.draw(ctx);
            }
        }
        else if (video) {
            showError(PreviewErrors.NO_DURATION);
        }
        else {
            showError(PreviewErrors.INVALID_VIDEO);
        }
    }
}