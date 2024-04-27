const express = require('express');
const app = express();




const port = 6000;

const taskRouter = require('./Router/taskController')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('', taskRouter)

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;