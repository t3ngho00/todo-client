import { Todos } from "./class/Todos.js";

document.addEventListener("DOMContentLoaded", function () {
    const BACKEND_ROOT_URL = 'http://localhost:3001';
    const todos = new Todos(BACKEND_ROOT_URL);
    const input = document.getElementById("todoInput");
    const list = document.getElementById("todoList");
        
    const renderSpan = (li, text) => {
        const span = li.appendChild(document.createElement('span'));
        span.innerHTML = text;
    };
    
    const renderLink = (li, id) => {
        const a = li.appendChild(document.createElement('a'));
        a.innerHTML = '<i class="bi bi-trash"></i>';
        a.setAttribute('style','float: right');
        a.setAttribute('data-id', id); // Add ID attribute to link
        // Add event listener to handle delete task action
        a.addEventListener('click', async (event) => {
            const taskId = event.target.getAttribute('data-id');
            try {
                await todos.removeTask(taskId);
                li.remove(); // Remove the task from UI on successful deletion
            } catch (error) {
                alert(error);
            }
        });
    };

    const renderTask = (task) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.setAttribute('data-key', task.getId().toString());
        renderSpan(li, task.getText());
        renderLink(li, task.getId());
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
