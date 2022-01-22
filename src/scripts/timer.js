const remaining = document.querySelector("#remaining");
const currentTimer = document.querySelector("#current");
const countdown = document.querySelector("#countdown");
const rounds = document.querySelector("#rounds");
const play = document.querySelector("#play");
const pause = document.querySelector("#pause");
const taskLabel = document.querySelector("#task-label");

let timerSettings = {
    workTimer: {
        title: "Work timer",
        seconds: 5,
        color: "#FF7171"
    },
    shortTimer: {
        title: "Short break timer",
        seconds: 10,
        color: "#6DDCCF",
    },
    longTimer: {
        title: "Long break timer",
        seconds: 15,
        color: "#A1CAE2"
    },
    rounds: 3
};

let mainInput = document.querySelector("#mainInput");
let shortInput = document.querySelector("#shortInput");
let longInput = document.querySelector("#longInput");
let roundsInput = document.querySelector("#roundsInput");
const applyInput = document.querySelector("#inputApply");

applyInput.addEventListener("click", () => {
    timerSettings.workTimer.seconds = Number(mainInput.value) * 60;
    timerSettings.shortTimer.seconds = Number(shortInput.value) * 60;
    timerSettings.longTimer.seconds = Number(longInput.value) * 60;
    timerSettings.rounds = Number(roundsInput.value);

    countdown.textContent = formatTimeLeft(timerSettings.workTimer.seconds)
    rounds.textContent = `Round ${roundCount+1} out of ${timerSettings.rounds}`

    current = timerSettings.workTimer.seconds;
})

let timeLeft,
    timerInterval,
    timePassed = 0,
    roundCount = 0,
    timerSwitch = 1,
    current = timerSettings.workTimer.seconds;

function formatTimeLeft(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

function setCircleDasharray() {
    const circleDasharray = `${(
        283 - (calculateTimeFraction() * 283)
    ).toFixed(0)} 283`;
    remaining.setAttribute("stroke-dasharray", circleDasharray);
}

function calculateTimeFraction() {
    return timeLeft / current;
}

function DOMUpdate(label){
    countdown.textContent = formatTimeLeft(timeLeft);
    currentTimer.textContent = label;
    rounds.textContent = `Round ${roundCount+1} out of ${timerSettings.rounds}`;
}

function backgroundColorChange(color){
    let r = document.querySelector(":root");
    r.style.setProperty("--bg-color", color);
}

function timer(){
    timePassed = timePassed += 1;
    timeLeft = current - timePassed;
    countdown.textContent = formatTimeLeft(timeLeft);
    setCircleDasharray();

    if(timeLeft <= 0){
        clearInterval(timerInterval);
        play.classList.toggle('active');
        pause.classList.toggle('active');
        remaining.setAttribute("stroke-dasharray", "0 283");
        timePassed = 0;

        if(roundCount >= timerSwitch){
            timerSwitch++;
            current = timerSettings.workTimer.seconds;
            timeLeft = current - timePassed;
            DOMUpdate(timerSettings.workTimer.title);
            backgroundColorChange(timerSettings.workTimer.color)
        } else {
            roundCount++;
            current = timerSettings.shortTimer.seconds;
            timeLeft = current - timePassed;
            DOMUpdate(timerSettings.shortTimer.title);
            backgroundColorChange(timerSettings.shortTimer.color)
        }

        if (roundCount >= timerSettings.rounds) {
            current = timerSettings.longTimer.seconds;
            timeLeft = current - timePassed;
            roundCount = 0;
            timerSwitch = 0;
            DOMUpdate(timerSettings.longTimer.title);
            backgroundColorChange(timerSettings.longTimer.color)
            list.children[0].remove();
            updateTasks();
        }

    }
}

play.addEventListener('click', function (){
    clearInterval(timerInterval);
    timerInterval = setInterval(timer, 1000);
    this.nextElementSibling.classList.remove('active');
    this.classList.add('active');
    taskLabel.textContent = list.children[0].children[0].textContent;
})

pause.addEventListener('click', function (){
    clearInterval(timerInterval);
    this.previousElementSibling.classList.remove('active');
    this.classList.add('active');
})

window.onload = function (){
    window.location.hash = "#timer-page"
}