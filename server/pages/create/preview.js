import { Video } from "/common/video/video.js";
import zeroPad from "/common/lib/zero-pad.js";

var canvasContainer;
var canvas;
var ctx;
var previewErrorsDiv;
var PreviewErrors = {};
var previewProgressBar;
var previewProgressTimeDone;
var previewProgressTotalTime;
var previewPlayPause;

export const init = () => {
    canvasContainer = document.getElementById("preview__canvas-container");
    canvas = document.getElementById("preview__canvas");
    ctx = canvas.getContext('2d');
    window.ctx = ctx;

    previewErrorsDiv = document.getElementById("preview__errors");
    PreviewErrors.BAD_JSON = document.getElementById("preview__errors__bad-json");
    PreviewErrors.INVALID_VIDEO = document.getElementById("preview__errors__invalid-video");
    PreviewErrors.NO_DURATION = document.getElementById("preview__errors__no-duration");

    previewProgressBar = document.getElementById("preview__progress__fill");
    previewProgressTimeDone = document.getElementById("preview__progress__time-done");
    previewProgressTotalTime = document.getElementById("preview__progress__total-time");

    previewPlayPause = document.getElementById("preview__controls__play-pause");
    previewPlayPause.addEventListener('click', () => {
        if (video) {
            if (playing) {
                previewPlayPause.classList.remove("playing");
                playing = false;
                cancelAnimationFrame(renderAnimationFrame);
            }
            else {
                previewPlayPause.classList.add("playing");
                playing = true;
                if (donePlaying) {
                    donePlaying = false;
                    videoPlayer.at = 0;
                }
                lastRendered = Date.now();
                renderAnimationFrame = requestAnimationFrame(renderNextFrame);
            }
        }
    });
};

const showError = errElem => {
    if(videoPlayer){
        videoPlayer.at = 0;
    }
    playing = false;
    previewPlayPause.classList.remove("playing");
    cancelAnimationFrame(renderAnimationFrame);
    previewProgressBar.style.width = "0%";
    previewProgressTimeDone.innerText = formatTime(0);
    previewProgressTotalTime.innerText = formatTime(0);

    previewPlayPause.classList.add("bad");
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
var canvasWidth;
var canvasHeight;

const renderNextFrame = () => {
    let dateNow = Date.now();
    let timeForward = (dateNow - lastRendered) / 1000;
    lastRendered = dateNow;
    if (videoPlayer.at + timeForward < videoPlayer.duration - video.spf) {
        renderAnimationFrame = requestAnimationFrame(renderNextFrame);

        videoPlayer.forward(timeForward);
        previewProgressBar.style.width = `${videoPlayer.at * 100 / videoPlayer.duration}%`;
        previewProgressTimeDone.innerText = formatTime(videoPlayer.at);
    }
    else {
        playing = false;
        donePlaying = true;
        previewPlayPause.classList.remove("playing");

        videoPlayer.forward(videoPlayer.duration - video.spf - videoPlayer.at);
        previewProgressBar.style.width = `100%`;
        previewProgressTimeDone.innerText = formatTime(videoPlayer.duration);
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

            var seekTo = 0;
            if (videoPlayer?.at < video.duration) {
                seekTo = videoPlayer.at;
            }
            else{
                donePlaying = false;
            }

            previewProgressBar.style.width = `${seekTo * 100 / video.duration}%`;
            previewProgressTimeDone.innerText = formatTime(seekTo);
            previewProgressTotalTime.innerText = formatTime(video.duration);

            videoPlayer = video.createPlayer();
            if (seekTo) {
                videoPlayer.seek(seekTo);
            }
            noErrors();
            videoPlayer.draw(ctx);

            previewPlayPause.classList.remove("bad");
        }
        else if (video) {
            showError(PreviewErrors.NO_DURATION);
        }
        else {
            showError(PreviewErrors.INVALID_VIDEO);
        }
    }
}