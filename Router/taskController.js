const express = require('express')
const router = express.Router();

const fs = require('fs')
const taskJson = require('../task.json')


const Validators = require('../helper/Validator')

router.get('/tasks', async (req, res) => {
    const result = await taskJson.tasks
    res.status(200).send(result)
})

router.get('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const filterResult = taskJson.tasks.find(data => data.id === parseInt(id))
    if (filterResult === undefined) {
        res.status(404).send({ message: 'No data present' })
    }
    res.status(200).send(filterResult)

})

router.put('/tasks/:id', async (req, res) => {

    const { id } = req.params;
    const updateUserTask = req.body;
    // const taskIndex = taskJson.tasks.findIndex(task => task.id === parseInt(id));
    // console.log(taskIndex)
    if (Validators.validateTaskInfo(updateUserTask).status === true) {

        const updateTaskInfo = {
            "id": Number(id),
            "title": updateUserTask.title,
            "description": updateUserTask.description,
            "completed": updateUserTask.completed
        };

        const taskIndex = taskJson.tasks.findIndex(task => task.id === parseInt(id));
        if (taskIndex === -1) {
            res.status(404).send({ message: "no id found" });
        }
        taskJson.tasks[taskIndex] = updateTaskInfo;

        fs.writeFile('./task.json', JSON.stringify(taskJson), { encoding: 'utf8', flag: 'w' }, (err) => {
            if (err) {
                res.status(404).send({ message: err });
            } else {

                res.status(200).send({ message: "Task updated successfully" });
            }

        })
    } else {
        let message = Validators.validateTaskInfo(updateUserTask).message;
        res.status(404).send(message);
    }


});





router.post('/tasks', async (req, res) => {
    const userTask = req.body;
    if (Validators.validateTaskInfo(userTask).status === true) {
        taskJson.tasks.push(userTask)
        fs.writeFile('./task.json', JSON.stringify(taskJson), { encoding: 'utf8', flag: 'w' }, (err) => {
            if (err) {
                res.status(500).send({ message: err });
            } else {
                res.status(201).send({ message: "Task created successfully" });
            }
        });
    } else {
        let message = Validators.validateTaskInfo(userTask).message;
        res.status(400).send(message);
    }


})








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
                res.status(404).send({ message: err });
            } else {
                res.status(200).send({ message: "Task Removed" });
            }
        });

    }
})

module.exports = router