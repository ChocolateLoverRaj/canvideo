//Create captions and generate .vtt files

//Zero pad a number to the left
function zeroPad(n, length) {
    let s = n.toString();
    return "0".repeat(length - s.length) + s;
}

//Get a formatted time
function formatTime(s) {
    let ms = Math.floor(s * 1000 % 1000);
    s = Math.floor(s);
    let m = Math.floor(s / 60);
    s %= 60;
    let h = Math.floor(m / 60);
    m %= 60;
    return `${zeroPad(h, 2)}:${zeroPad(m, 2)}:${zeroPad(s, 2)}.${zeroPad(ms, 3)}`;
}

//All times must be less than this time
const tooLargeTime =
    60 * //1 Minute
    60 * //1 Hour
    100; //100 Hours

//Caption class
class Caption {
    static vttHeader = 'WEBVTT\n';

    constructor() {
        this.texts = [];
    }

    add(start, end, text) {
        if (typeof start === 'number' && typeof end === 'number' && start < end && typeof text === 'string') {
            this.texts.push({
                start,
                end,
                text
            });
        }
        else {
            throw new TypeError("Invalid arguments.");
        }
        return this;
    }

    toVtt(includeHeader = true, offset = 0) {
        if (typeof includeHeader === 'boolean' && typeof offset === 'number') {
            let vtt = includeHeader ? Caption.vttHeader : '';
            for (let { start, end, text } of this.texts) {
                start += offset;
                end += offset;

                if (start < 0) {
                    throw new TypeError("Out of range - start value is less than 0.");
                }
                if (start >= tooLargeTime) {
                    throw new TypeError("Out of range - start value is >= 100 hours.");
                }
                if (end < 0) {
                    throw new TypeError("Out of range - end value is less than 0.");
                }
                if (end >= tooLargeTime) {
                    throw new TypeError("Out of range - end value is >= 100 hours.");
                }

                vtt += `\n\n${formatTime(start)} --> ${formatTime(end)}\n${text}`;
            }
            return vtt;
        }
        else {
            throw new TypeError("Invalid arguements.");
        }
    }
}

module.exports = Caption;