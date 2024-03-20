// Task 1
document.addEventListener("DOMContentLoaded", function () {
    // Get references to UI elements
    const todoInput = document.getElementById("todoInput");
    const todoList = document.getElementById("todoList");

    // Check if UI elements are found
    if (!todoInput || !todoList) {
        console.error("UI elements not found");
        return;
    }

    // Add event listener for input field
    todoInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            const todoText = todoInput.value.trim(); // Get the input text and remove leading/trailing spaces
            if (todoText !== "") {
                const listItem = document.createElement("li"); // Create a new list item
                listItem.classList.add("list-group-item");
                listItem.innerText = todoText;
                todoList.appendChild(listItem); // Append the new list item to the todo list
                todoInput.value = ""; // Clear the input field
            } else {
                console.warn("Empty todo input"); // Log a warning if the input is empty
            }
        }
    });
    console.log("Script initialized successfully");
});