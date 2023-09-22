import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/todo-list', { useNewUrlParser: true, useUnifiedTopology: true });

const taskSchema = new mongoose.Schema({
    text: String,
    completed: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Get all tasks from the database
app.get('/tasks', async (req, res) => {
    
    try {
        const tasks = await Task.find({});
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Add a new task to the database
app.post('/addTask', async (req, res) => {
    const taskText = req.body.taskText;

    // tastText not in the Task schema
    const tasks = await Task.find({});
    // console.log(tasks);
    
    

    var present=false;
    for(var i=0; i<tasks.length; i++) {
        if (taskText === tasks[i].text) {
            present = true;
            // console.log('Task already exists');
            // res.status(400).send('Task already exists');
        }
    };

    // const present = tasks.includes(taskText);
    // console.log(present);

    if (taskText && !present) {
        try {
            const task = new Task({ text: taskText, completed: false });
            await task.save();
            res.status(200).send('Task added successfully.');
        } catch (err) {
            console.error(err);
            res.status(500).send('Failed to add task.');
        }
    } else {
        res.status(400).send('Task text cannot be empty.');
    }

    // if (taskText && taskText != tasks[i].text) {
        
});

// Update the completion status of a task
app.post('/completeTask', async (req, res) => {
    const taskText = req.body.taskText;
    const completed = req.body.completed;

    const booleanCompleted = completed === 'true';

    if (typeof taskText === 'string' && typeof booleanCompleted === 'boolean') {
        // Update the task status in both the in-memory list and the database
        try {
            const task = await Task.updateOne({text: taskText}, { completed: booleanCompleted });
            // console.log(task);
            // await task.save();

            res.status(200).send('Task status updated successfully.');
        } catch (err) {
            console.error(err);
            res.status(500).send('Failed to update task status.');
        }

    } else {
        res.status(400).send('Invalid request.');
    }
});





app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
