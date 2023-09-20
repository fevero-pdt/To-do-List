document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const taskCheckboxes = document.querySelectorAll(".taskCheckbox");
    const taskLabels = document.querySelectorAll(".taskLabel");

    // Function to create a new task item
    function createTaskItem(taskText) {
        const listItem = document.createElement("li");

        // Create a checkbox input
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "taskCheckbox";
        // listItem.appendChild(checkbox);

        // Create a label for the checkbox
        const label = document.createElement("label");
        label.className = "taskLabel";
        label.textContent = taskText;
        // listItem.appendChild(label);

        const breakLine = document.createElement("br");

        // Add the task item to the task list
        taskList.appendChild(checkbox);
        taskList.appendChild(label);
        taskList.appendChild(breakLine);

        // Add a click event listener to the checkbox
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                label.style.textDecoration = "line-through";
            } else {
                label.style.textDecoration = "none";
            }
        });
    }

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the default form submission

        const taskText = taskInput.value.trim();

        if (taskText !== "") {
            // Send a POST request to add the task
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
                // If task is added successfully, create and add it to the list on the page
                createTaskItem(taskText);
                taskInput.value = "";
            })
            .catch((error) => {
                console.error(error);
            });
        }
    });

    // Fetch and display existing tasks when the page loads
    fetch('/tasks')
    .then((response) => response.json())
    .then((data) => {
        data.forEach((task) => {
            createTaskItem(task.text);

            // Check the checkbox if the task is marked as completed
            // const taskIndex = Array.from(taskLabels).findIndex((label) => label.textContent === task.text);
            const taskCheckbox = taskList.querySelector(`input.taskCheckbox[value="${task.text}"]`);
            if (taskIndex !== -1) {
                taskCheckboxes[taskIndex].checked = true;
                taskLabels[taskIndex].style.textDecoration = "line-through";
            }
        });
    })
    .catch((error) => {
        console.error(error);
    });
});
