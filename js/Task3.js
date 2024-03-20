// Task 3

document.addEventListener("DOMContentLoaded", function () {
    const BACKEND_ROOT_URL = 'http://localhost:3001';
    const input = document.getElementById("todoInput");
    const list = document.getElementById("todoList");
    //input.disabled = true;

    const renderTask = (task) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.innerText = task;
        list.appendChild(li);
    };

    const getTasks = async (list, input) => {
        try {
            const response = await fetch(BACKEND_ROOT_URL);
            const json = await response.json();
            json.forEach(task => {
                renderTask(task.description);
            });
            input.disabled = false;
        } catch (error) {
            alert("Error retrieving tasks: " + error.message);
        }
    };

    const saveTasks = async (task) => {
        try {
            const json = JSON.stringify({ description: task });
            const response = await fetch(BACKEND_ROOT_URL + '/new', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: json
            });
            return response.json();
        } catch (error) {
            alert("Error saving tasks: " + error.message);
        }
    };

    input.addEventListener("keypress", async function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const task = input.value.trim();
            if (task !== "") {
                try {
                    await saveTasks(task);
                    renderTask(task, list);
                    input.value = "";
                } catch (error) {
                    alert("Error saving task: " + error.message);
                }
            } else {
                console.warn("Empty todo input");
                input.value = "";
            }
        }
    });

    getTasks();
});
