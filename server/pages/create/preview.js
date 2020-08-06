import { Video } from "/common/video/video.js";

var canvasContainer;
var canvas;
var ctx;
var previewErrorsDiv;
var PreviewErrors = {};

export const init = () => {
    canvasContainer = document.getElementById("preview__canvas-container");
    canvas = document.getElementById("preview__canvas");
    ctx = canvas.getContext('2d');
    window.ctx = ctx;
    previewErrorsDiv = document.getElementById("preview__errors");

    PreviewErrors.BAD_JSON = document.getElementById("preview__errors__bad-json");
    PreviewErrors.INVALID_VIDEO = document.getElementById("preview__errors__invalid-video");
    PreviewErrors.NO_DURATION = document.getElementById("preview__errors__no-duration");
};

const showError = errElem => {
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
}

var video;
var videoPlayer;
var timeInVideo = 0;
var canvasWidth;
var canvasHeight;
export const updateVideo = text => {
    let videoJson;
    let goodJson = true;
    try {
        videoJson = JSON.parse(text);
    }
    catch{
        showError(PreviewErrors.BAD_JSON);
        goodJson = false;
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

            videoPlayer = video.createPlayer();
            if (timeInVideo < videoPlayer.duration) {
                videoPlayer.seek(timeInVideo);
            }
            noErrors();
            videoPlayer.draw(ctx);
            console.log("draw");
        }
        else if (video) {
            showError(PreviewErrors.NO_DURATION);
        }
        else {
            showError(PreviewErrors.INVALID_VIDEO);
        }
    }
}