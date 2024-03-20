// ./js/class/Task.js

class Task {
    #id
    #text

    constructor(id,text) {
        this.#id = id;
        this.#text = text;
    }

    getId() {
        return this.#id;
    };

    getText() {
        return this.#text;
    };
}

export { Task };

// ./js/class/Todos.js
import { Task } from "./Task.js";

class Todos {
    #tasks = [];
    #backend_url = '';

    constructor(url) {
        this.#backend_url = url;
    }

    getTasks = () => {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await fetch(this.#backend_url);
                const tasks = await response.json();
                this.#readJson(tasks);
                resolve(this.#tasks);
            } catch (error) {
                reject("Error retrieving tasks: " + error.message);
            }
        });
    }

    addTasks = (text) => {
        return new Promise(async(resolve, reject) => {
            try {
                const json = JSON.stringify({ description: text });
                const response = await fetch(this.#backend_url + '/new', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: json
                });
                const taskData = await response.json();
                const task = this.#addToArray(taskData.id, text);
                resolve(task);
            } catch (error) {
                reject("Error saving tasks: " + error.message);
            }
        });
    };

    #readJson = (tasksArray) => {
        tasksArray.forEach(taskData => {
            const task = new Task(taskData.id, taskData.description)
            this.#tasks.push(task)
        })
    }

    #addToArray = (id, text) => {
        const task = new Task(id, text);
        this.#tasks.push(task);
        return task;
    }
}

export { Todos };

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

