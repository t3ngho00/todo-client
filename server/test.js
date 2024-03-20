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

// Task 5
import { text } from "body-parser";
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
        //li.innerText = task.getText();
        renderSpan(li,task.getText());
        renderLink(li,task.getId());
        list.appendChild(li);
    };

    const renderSpan = (li,text) => {
        const span = li.appendChild(document.createElement('span'));
        span.innerHTML = text;
    };

    const renderLink = (li,id) => {
        const a = li.appendChild(document.createElement('a'));
        a.innerHTML = '<i class="bi bi-trash"></i>'
        a.setAttribute('style','float: right')
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

//backend
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Create a pool outside of the openDb function
const openDb = () => {
    const pool = new Pool ({
        user: 'postgres',
        host: 'localhost',
        database: 'todo',
        password: 'abcd',
        port: 5432
    });
    return pool;
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const port = 3001;

app.get("/", (req , res) => {
    const pool = openDb (); 
    pool.query('SELECT * FROM task', (error, result) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json(result.rows);
    });
});

app.post("/new", (req, res) => {
    const pool = openDb ();
    pool.query('INSERT INTO task (description) VALUES ($1) RETURNING *',
        [req.body.description],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(200).json({ id: result.rows[0].id });
        }
    );
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Close database pool when the application shuts down
process.on('SIGINT', () => {
    pool.end(() => {
        console.log('Database pool has been closed.');
        process.exit(0);
    });
});

app.delete("/delete/:id",async(req,res) => {
    const pool = openDb();
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query('DELETE FROM task WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.status(200).json({ id: id });
        }
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        pool.end();
    }
});

app.listen(port);
