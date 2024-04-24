const express = require('express');
const app = express();
const router=express.Router()
const PORT = 3000

// const taskapp = require('./app/Task')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('', taskapp)
const taskJson = require('../task.json')
const fs = require('fs')



router.get('/tasks', async (req, res) => {
    const result = await taskJson.tasks
    res.status(200).send(result)
})

router.get('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const filterResult = taskJson.tasks.find(data => data.id === parseInt(id))
    if (filterResult === undefined) {
        res.status(201).send({ message: 'No data present' })
    }
    res.status(201).send(filterResult)

})

router.post('/tasks', async (req, res) => {
    const userTask = req.body;
    let isDuplicateFound = taskJson.tasks.filter(data => data.id === parseInt(userTask.id))
    if (isDuplicateFound.length !== 0) {
        res.status(400).send({ message: "validation error" });
    } else {
        taskJson.tasks.push(userTask)
        fs.writeFile('./task.json', JSON.stringify(taskJson), { encoding: 'utf8', flag: 'w' }, (err) => {
            if (err) {
                res.status(500).send({ message: err });
            } else {
                res.status(200).send({ message: "Task created successfully" });
            }
        });
    }

})

router.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const updateUserTask = req.body;
    let existingUserData = taskJson.tasks.find(task => task.id === parseInt(id));

    // Check if the task with the specified ID exists
    if (existingUserData === undefined) {
        return res.status(404).send({ error: 'Task not found' });
    }
    console.log(updateUserTask)

    const updateTaskInfo = {
        "id": id,
        "title": updateUserTask.title,
        "description": updateUserTask.description,
        "completed": updateUserTask.completed
    };

    const taskIndex = taskJson.tasks.findIndex(task => task.id === parseInt(id));
    taskJson.tasks[taskIndex] = updateTaskInfo;

    // Write the updated taskJson object to the file
    fs.writeFile('./task.json', JSON.stringify(taskJson), { encoding: 'utf8', flag: 'w' }, (err) => {
        if (err) {
            return res.status(500).send({ message: err });
        }
        console.log("Task updated successfully:", updateTaskInfo);
        res.status(200).send({ message: "Task updated successfully" });
    });
});









router.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const taskIndex = taskJson.tasks.findIndex(task => task.id === parseInt(id));
    console.log(taskIndex)
    if (taskIndex === -1) {
        res.status(404).json({ error: 'Task not found' });
    } else {
        taskJson.tasks.splice(taskIndex, 1);
        fs.writeFile('./task.json', JSON.stringify(taskJson), { encoding: 'utf8', flag: 'w' }, (err) => {
            if (err) {
                res.status(500).send({ message: err });
            } else {
                res.status(200).send({ message: "Task Removed" });
            }
        });

    }
})

app.listen(3000, (err) => {
    if (err) {
        console.log(err)
    }
    console.log(`Server is running on :${3000}`)
})