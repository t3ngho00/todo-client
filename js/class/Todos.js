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

    removeTask = (id) => {
        return new Promise(async(resolve, reject) => {
            fetch(this.#backend_url + '/delete/' + id,{
                method: 'delete'
            })
            .then((response) => response.json())
            .then((json) => {
                this.#removeFromArray(id)
                resolve(json.id)
            },(error) => {
                reject(error)
            })
        })
    }

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

    #removeFromArray = (id) => {
        const arrayWithoutRemoved = this.#tasks.filter(task => task.id !== id);
        this.#tasks = arrayWithoutRemoved;
    }
}

export { Todos };