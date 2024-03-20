// Task 4

import { Todos } from "./class/Todos.js";

document.addEventListener("DOMContentLoaded", function () {
    const BACKEND_ROOT_URL = 'http://localhost:3001';
    const todos = new Todos(BACKEND_ROOT_URL);
    const input = document.getElementById("todoInput");
    const list = document.getElementById("todoList");
    //input.disabled = true;

    const renderTask = (task) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.innerText = task.getText();
        list.appendChild(li);
    };

    const getTasks = () => {
        todos.getTasks().then((tasks) => {
            tasks.forEach(task => {
                renderTask(task)
            })
        }).catch((error) => {
            alert(error)
        })
    };

    input.addEventListener("keypress", async function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const task = input.value.trim();
            if (task !== "") {
                todos.addTasks(task).then((task) => {
                    renderTask(task);
                    input.value = "";
                    input.focus();    
                }).catch((error) => {
                    alert(error);
                }); 
            }
        }
    });

    getTasks();
});
