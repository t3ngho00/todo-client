// Task 3
//Add constant variable that holds url for the backend. By default, input field is disabled.
const BACKEND_ROOT_URL = 'http://localhost:3001';
const list = document.querySelector('ul');
const input = document.querySelector('input');

input.disabled = true;


/*Create a separate function for rendering a task. This (same) function will be used, when a new task is added, or tasks are retrieved from backend. Test out that front-end is
still working after making following modification. 
*/
const renderTask = (task) => {
    const li = document.createElement('li');
    li.setAttribute('class','list-group-item');
    li.innerHTML = task;
    li.append(li);
};

/*Define the function that fetches data from the backend by making HTTP call. JSON is received as response.
JSON (array) is looped through and each JSON object holding task is rendered to the UI.
User can add new tasks after data is retrieved. */

const getTasks = async () => {
    try {
        const response = await fetch(BACKEND_ROOT_URL);
        const json = await response.json();
        json.forEach(task => {
            renderTask(task.description);
        });
        input.disabled = false;
    }   catch (error) {
        alert("Error retrieving tasks" + error.mesage);
    }
};

const saveTasks = async () => {
    try {
        const json = JSON.stringify({description: task});
        const response = await fetch(BACKEND_ROOT_URL + '/new',{
            method: 'post',
            headers: {
                'Content-Type':'application/json';
            },
            body: json
        });
        return response.json();
    }   catch (error) {
        alert("Error saving tasks" + error.mesage);
    }
}; 

// Add event listener for input field
input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        const task = input.value.trim(); // Get the input text and remove spaces
        if (task !== "") {
            saveTasks(task).then((json) => {
                renderTask(task);
                input.value = "";
            })
        } else {
            console.warn("Empty todo input"); // Log a warning if the input is empty
        }
    }
});


