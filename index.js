import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import mongodb from 'mongodb';
import assert from 'assert';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));

// Create an array to store tasks in memory
const taskList = [];

app.use(express.static(__dirname + '/public')); // Serve static files from the 'public' directory




// Get all tasks from memory
app.get('/tasks', (req, res) => {
    res.json(taskList);
});

// Add a new task to the list
app.post('/addTask', (req, res) => {
    
    const taskText = req.body.taskText;
    // console.log(taskText);

    if (taskText) {
        // Add the task to the in-memory list
        
        taskList.push({ text: taskText });
        

        // Send a success response
        res.status(200).send('Task added successfully.');
    } else {
        // Send an error response if the task text is empty
        res.status(400).send('Task text cannot be empty.');
    }
});

// clicking the checkbox will send a POST request to the server to mark the task as complete
app.post('/completeTask', (req, res) => {
    const taskIndex = req.body.taskIndex;
    console.log(taskIndex);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
