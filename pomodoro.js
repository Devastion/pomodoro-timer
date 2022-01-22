var textarea = document.querySelector("#add-textarea");
var add = document.querySelector("#add-btn");
var list = document.querySelector("#list");
var clear = document.querySelector("#clear");
var tasksStorage = [];

function newTask(task) {
  var box = document.createElement("div");
  box.className = "tasks-page__list---box";
  var h2 = document.createElement("h2");
  h2.innerText = task;
  var edit = document.createElement("button");
  edit.className = "edit";
  edit.textContent = "Edit";
  var remove = document.createElement("button");
  remove.className = "remove";
  remove.textContent = "Remove";
  var clearfix = document.createElement("div");
  clearfix.className = "clearfix";
  box.innerHTML = h2.outerHTML + edit.outerHTML + remove.outerHTML + clearfix.outerHTML;
  list.append(box);
}

function render(elements) {
  list.innerHTML = "";
  elements.forEach(function (el) {
    return newTask(el);
  });
}

add.addEventListener("click", function (e) {
  if (textarea.value !== "") {
    tasksStorage.push(textarea.value);
    textarea.value = "";
    render(tasksStorage);
    clear.style.display = "block";
    localStorage.setItem("tasks", JSON.stringify(tasksStorage));
  } else {
    alert("Please input a task!");
  }
});
var savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
  tasksStorage = JSON.parse(localStorage.getItem("tasks"));
  render(tasksStorage);
  clear.style.display = "block";
} else {
  clear.style.display = "none";
}

clear.addEventListener("click", function () {
  if (confirm("Are you sure?")) {
    localStorage.clear();
    list.innerHTML = "";
    tasksStorage = [];
    clear.style.display = "none";
  }
});
list.addEventListener("click", function (event) {
  var e = event.target;

  if (e.classList.contains("remove")) {
    if (confirm("Are you sure?")) {
      var childTask = e.parentNode;
      var updateArray = childTask.children[0].textContent;
      var index = tasksStorage.indexOf(updateArray);
      tasksStorage.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasksStorage));
      list.removeChild(childTask);
    }
  }

  if (e.textContent === "Edit") {
    e.onclick = function () {
      var child = e.parentNode;
      child.children[0].contentEditable = "true";
      child.children[0].focus();
      e.textContent = "Done";
    };
  }

  if (e.textContent === "Done") {
    e.onclick = function () {
      var child = e.parentNode;
      child.children[0].contentEditable = "false";
      e.textContent = "Edit";
      updateTasks();
    };
  }
});

function updateTasks() {
  tasksStorage = [];

  for (var i = 0; i < list.children.length; i++) {
    tasksStorage.push(list.children[i].children[0].textContent);
  }

  localStorage.setItem("tasks", JSON.stringify(tasksStorage));
}
var remaining = document.querySelector("#remaining");
var currentTimer = document.querySelector("#current");
var countdown = document.querySelector("#countdown");
var rounds = document.querySelector("#rounds");
var play = document.querySelector("#play");
var pause = document.querySelector("#pause");
var taskLabel = document.querySelector("#task-label");
var timerSettings = {
  workTimer: {
    title: "Work timer",
    seconds: 5,
    color: "#FF7171"
  },
  shortTimer: {
    title: "Short break timer",
    seconds: 10,
    color: "#6DDCCF"
  },
  longTimer: {
    title: "Long break timer",
    seconds: 15,
    color: "#A1CAE2"
  },
  rounds: 3
};
var mainInput = document.querySelector("#mainInput");
var shortInput = document.querySelector("#shortInput");
var longInput = document.querySelector("#longInput");
var roundsInput = document.querySelector("#roundsInput");
var applyInput = document.querySelector("#inputApply");
applyInput.addEventListener("click", function () {
  timerSettings.workTimer.seconds = Number(mainInput.value) * 60;
  timerSettings.shortTimer.seconds = Number(shortInput.value) * 60;
  timerSettings.longTimer.seconds = Number(longInput.value) * 60;
  timerSettings.rounds = Number(roundsInput.value);
  countdown.textContent = formatTimeLeft(timerSettings.workTimer.seconds);
  rounds.textContent = "Round ".concat(roundCount + 1, " out of ").concat(timerSettings.rounds);
  current = timerSettings.workTimer.seconds;
});
var timeLeft,
    timerInterval,
    timePassed = 0,
    roundCount = 0,
    timerSwitch = 1,
    current = timerSettings.workTimer.seconds;

function formatTimeLeft(time) {
  var minutes = Math.floor(time / 60);
  var seconds = time % 60;

  if (minutes < 10) {
    minutes = "0".concat(minutes);
  }

  if (seconds < 10) {
    seconds = "0".concat(seconds);
  }

  return "".concat(minutes, ":").concat(seconds);
}

function setCircleDasharray() {
  var circleDasharray = "".concat((283 - calculateTimeFraction() * 283).toFixed(0), " 283");
  remaining.setAttribute("stroke-dasharray", circleDasharray);
}

function calculateTimeFraction() {
  return timeLeft / current;
}

function DOMUpdate(label) {
  countdown.textContent = formatTimeLeft(timeLeft);
  currentTimer.textContent = label;
  rounds.textContent = "Round ".concat(roundCount + 1, " out of ").concat(timerSettings.rounds);
}

function backgroundColorChange(color) {
  var r = document.querySelector(":root");
  r.style.setProperty("--bg-color", color);
}

function timer() {
  timePassed = timePassed += 1;
  timeLeft = current - timePassed;
  countdown.textContent = formatTimeLeft(timeLeft);
  setCircleDasharray();

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    play.classList.toggle('active');
    pause.classList.toggle('active');
    remaining.setAttribute("stroke-dasharray", "0 283");
    timePassed = 0;

    if (roundCount >= timerSwitch) {
      timerSwitch++;
      current = timerSettings.workTimer.seconds;
      timeLeft = current - timePassed;
      DOMUpdate(timerSettings.workTimer.title);
      backgroundColorChange(timerSettings.workTimer.color);
    } else {
      roundCount++;
      current = timerSettings.shortTimer.seconds;
      timeLeft = current - timePassed;
      DOMUpdate(timerSettings.shortTimer.title);
      backgroundColorChange(timerSettings.shortTimer.color);
    }

    if (roundCount >= timerSettings.rounds) {
      current = timerSettings.longTimer.seconds;
      timeLeft = current - timePassed;
      roundCount = 0;
      timerSwitch = 0;
      DOMUpdate(timerSettings.longTimer.title);
      backgroundColorChange(timerSettings.longTimer.color);
      list.children[0].remove();
      updateTasks();
    }
  }
}

play.addEventListener('click', function () {
  clearInterval(timerInterval);
  timerInterval = setInterval(timer, 1000);
  this.nextElementSibling.classList.remove('active');
  this.classList.add('active');
  taskLabel.textContent = list.children[0].children[0].textContent;
});
pause.addEventListener('click', function () {
  clearInterval(timerInterval);
  this.previousElementSibling.classList.remove('active');
  this.classList.add('active');
});

window.onload = function () {
  window.location.hash = "#timer-page";
};
//# sourceMappingURL=pomodoro.js.map
