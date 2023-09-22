

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
                    return response.text();
                } else {
                    throw new Error('Failed to add task.');
                }
            })
            .then(() => {
                // If the task is added successfully, add it to the list on the page
                createTaskItem(taskText);
                taskInput.value = "";
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
        // listItem.className = "taskItem";

        // Create a checkbox input for marking tasks as completed
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "taskCheckbox";

        // Store a reference to the listItem in the checkbox's data attribute
        checkbox.dataset.taskText = taskText;

        const label = document.createElement("label");
        label.className = "taskLabel";
        label.textContent = taskText;

        const breakLine = document.createElement("br");

        // Append the list item to the task list
        taskList.appendChild(listItem);
        listItem.appendChild(checkbox);
        listItem.appendChild(label);
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
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error('Failed to update task status.');
                }
            })
            .then(() => {
                markTaskAsCompleted(listItem, completed);
            })
            .catch((error) => {
                console.error(error);
            });
        });
    }

    // Function to mark a task as completed
    function markTaskAsCompleted(listItem, completed) {
        if (completed) {
            // Add a strikethrough style to the label
            listItem.style.textDecoration = "line-through";
        } else {
            // Remove the strikethrough style
            listItem.style.textDecoration = "none";
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
