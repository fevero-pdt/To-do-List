

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");

    // Display today's date
    // const today = new Date("June 24, 2023 11:13:00");


    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    
    document.getElementsByClassName("todayDate")[0].innerHTML = currentDate + "/" + currentMonth + "/" + currentYear;
    
    // document.getElementsByClassName("todayDate"). = currentDate + "/" + currentMonth + "/" + currentYear;

    // document.getElementsByClassName("todayDate")[1].innerHTML = currentDate;

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the default form submission

        const taskText = taskInput.value.trim();

        if (taskText !== "") {
            // Send a POST request to add the task to the server
            fetch('/addTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `taskText=${encodeURIComponent(taskText)}`,
            })
            .then((response) => {
                if (response.ok) {
                    // If the task is added successfully, add it to the list on the page
                    createTaskItem(taskText);
                    taskInput.value = "";
                    // return response.text();
                } else if (response.status === 400) {
                    return response.text().then((errorMessage) => {
                        // Display an alert with the error message
                        alert(errorMessage);
                        
                        // Reload the page after displaying the alert
                        // window.location.reload();

                    });
                } else {
                    throw new Error('Failed to add task.');
                }
            })
            .catch((error) => {
                console.error(error);
            });
        }
    });

    // Function to create a new task item on the page
    function createTaskItem(taskText) {
        // Create a list item
        const listItem = document.createElement("div");
        listItem.className = "taskItem";

        // Create a checkbox input for marking tasks as completed
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "taskCheckbox";

        // Store a reference to the listItem in the checkbox's data attribute
        checkbox.dataset.taskText = taskText;

        const label = document.createElement("label");
        label.className = "taskLabel";
        label.textContent = taskText;

        // delete button
        const deleteButton = document.createElement("button");
        deleteButton.className = "deleteButton";
        deleteButton.textContent = "Delete";

        // Update the delete button event listener
        deleteButton.addEventListener("click", () => {
            const taskText = checkbox.dataset.taskText;

            // Show a confirmation dialog
            const confirmDelete = window.confirm("Are you sure you want to delete this task?");

            if (confirmDelete) {
                // User confirmed deletion, send a POST request to delete the task from the server
                fetch('/deleteTask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `taskText=${encodeURIComponent(taskText)}`,
                })
                .then((response) => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        throw new Error('Failed to delete task.');
                    }
                })
                .then(() => {
                    // If the task is deleted successfully, remove it from the list on the page
                    taskList.removeChild(listItem);
                })
                .catch((error) => {
                    console.error(error);
                });
            }
        });


        

        const breakLine = document.createElement("br");

        // Append the list item to the task list
        taskList.appendChild(listItem);
        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        listItem.appendChild(deleteButton);
        listItem.appendChild(breakLine);

        checkbox.addEventListener("change", () => {
            const taskText = checkbox.dataset.taskText;
            const completed = checkbox.checked;

            // Send a POST request to update task completion status
            fetch('/completeTask', {
                
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `taskText=${encodeURIComponent(taskText)}&completed=${encodeURIComponent(completed)}`,
            })
            .then((response) => {
                console.log(response);
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error('Failed to update task status.');
                }
            })
            .then(() => {
                // If the task is updated successfully, update its appearance on the page
                console.log("Task status updated successfully.");
                markTaskAsCompleted(listItem, completed);
            })
            .catch((error) => {
                console.error(error);
            });
        });
    }

    function markTaskAsCompleted(listItem, completed) {
        if (completed) {
            // Add the "completed" class to the task item
            listItem.classList.add("completed");
        } else {
            // Remove the "completed" class from the task item
            listItem.classList.remove("completed");
        }
    }

    // Fetch and display existing tasks when the page loads
    fetch('/tasks')
    .then((response) => response.json())
    .then((data) => {
        data.forEach((task) => {
            createTaskItem(task.text);

            // Check the checkbox if the task is marked as completed
            if (task.completed) {
                const listItem = taskList.lastChild;
                const checkbox = listItem.firstChild;
                checkbox.checked = true;
                markTaskAsCompleted(listItem, true);
            }
        });
    })
    .catch((error) => {
        console.error(error);
    });
});
