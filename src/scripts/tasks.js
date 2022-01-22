const textarea = document.querySelector("#add-textarea");
const add = document.querySelector("#add-btn");
const list = document.querySelector("#list");
const clear = document.querySelector("#clear");
let tasksStorage = [];

function newTask(task) {
    let box = document.createElement("div");
    box.className = "tasks-page__list---box"

    let h2 = document.createElement("h2");
    h2.innerText = task;

    let edit = document.createElement("button");
    edit.className = "edit";
    edit.textContent = "Edit";

    let remove = document.createElement("button");
    remove.className = "remove";
    remove.textContent = "Remove";

    let clearfix = document.createElement("div");
    clearfix.className = "clearfix";

    box.innerHTML = h2.outerHTML + edit.outerHTML + remove.outerHTML + clearfix.outerHTML;
    list.append(box);
}

function render(elements){
    list.innerHTML = "";
    elements.forEach(el => newTask(el));
}

add.addEventListener("click", e => {
    if(textarea.value !== ""){
        tasksStorage.push(textarea.value);
        textarea.value = "";
        render(tasksStorage);
        clear.style.display = "block";
        localStorage.setItem("tasks", JSON.stringify(tasksStorage));
    } else {
        alert("Please input a task!")
    }
})

let savedTasks = localStorage.getItem("tasks");
if(savedTasks){
    tasksStorage = JSON.parse(localStorage.getItem("tasks"));
    render(tasksStorage);
    clear.style.display = "block";
} else {
    clear.style.display = "none";
}

clear.addEventListener("click", () => {
    if(confirm("Are you sure?")){
        localStorage.clear();
        list.innerHTML = "";
        tasksStorage = [];
        clear.style.display = "none";
    }
})

list.addEventListener("click", (event) => {
    let e = event.target;
    if(e.classList.contains("remove")){
        if(confirm("Are you sure?")){
            let childTask = e.parentNode;
            let updateArray = childTask.children[0].textContent;
            let index = tasksStorage.indexOf(updateArray);
            tasksStorage.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasksStorage))
            list.removeChild(childTask);
        }
    }

    if(e.textContent === "Edit"){
        e.onclick = () => {
            let child = e.parentNode;
            child.children[0].contentEditable = "true";
            child.children[0].focus();
            e.textContent = "Done";
        }
    }

    if(e.textContent === "Done"){
        e.onclick = () => {
            let child = e.parentNode;
            child.children[0].contentEditable = "false";
            e.textContent = "Edit";
            updateTasks();
        }
    }
})

function updateTasks(){
    tasksStorage = [];
    for(let i = 0; i < list.children.length; i++){
        tasksStorage.push(list.children[i].children[0].textContent);
    }
    localStorage.setItem("tasks", JSON.stringify(tasksStorage));
}