// adjust these parameters
const MIN_AREA = 20;
const MIN_X = 0;
const MIN_Y = 0;

const COLORS = ['magenta', 'cyan'];

let [milliseconds,seconds,minutes,hours] = [0,0,0,0];
let timerRef = document.querySelector('.timerDisplay');
var video = document.querySelector("#videoElement");
var tracker = new tracking.ColorTracker(COLORS);
var resultsList = document.querySelector('#resultsList')
var seen = [];
let int = null;

const resetTimer = () => {
    clearInterval(int);
    [milliseconds,seconds,minutes,hours] = [0,0,0,0];
    timerRef.innerHTML = '00 : 00 : 000';
    seen = [];
    $(resultsList).empty()
}

const startTimer = () => {
    if(int !== null){
        clearInterval(int);
    }
    int = setInterval(displayTimer, 10);
}

const pauseTimer = () => {
    clearInterval(int);
}

const displayTimer = () => {
    milliseconds+=10;
    if (milliseconds == 1000){
        milliseconds = 0;
        seconds++;
        if (seconds == 60){
            seconds = 0;
            minutes++;
        }
    }
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;
    let ms = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds;
    timerRef.innerHTML = `${m} : ${s} : ${ms}`;
}

function drawRect(x, y, w, h, color){
    var rect = $('<div></div>');   
    rect.addClass('rect');
    rect.css({ 
        border : '2px solid ' + color,
        width : w + 'px',
        height : h + 'px',
        left : x + 'px',
        top : y + 'px'
    });
    $('#videoElement').append(rect);
}

navigator.mediaDevices.getUserMedia();

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (error) {
      console.log("Something went wrong!");
    });
}

tracker.on('track', function(event) {
    event.data.forEach(function(rect) {
        const time = timerRef.innerHTML;
        const area = rect.width * rect.height;
        if (time != '00 : 00 : 000' && area > MIN_AREA && !seen.includes(rect.color)) {
            console.log(rect.x, rect.y)

            drawRect(rect.x, rect.y, rect.width, rect.height, rect.color);
            var li = document.createElement('li');
            li.appendChild(document.createTextNode(`${rect.color}'s time - ${time}`));
            li.classList.add(`result-li-${rect.color}`);
            resultsList.appendChild(li);

            seen.push(rect.color);
        }
    });
});

document.getElementById('startTimer').addEventListener('click', startTimer);
document.getElementById('pauseTimer').addEventListener('click', pauseTimer);
document.getElementById('resetTimer').addEventListener('click', resetTimer);
tracking.track('#videoElement', tracker);