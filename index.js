const express = require('express')
const app = express()
const fs = require('node:fs')


const path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const readFile = (filename) => {
    return new Promise((resolve,reject) => {
        fs.readFile(filename, 'utf-8', (err,data) => {
            if (err) {
                console.error(err);
                return;
            }  
            const tasks = JSON.parse(data)
            resolve(tasks)
        });
    })
}
const writeFile = (filename, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, 'utf-8', err => {
            if (err) {
                console.error(err);
                return;
            }
            resolve(true)
        });
    })
}
app.get('/', (req,res) => {
    readFile ('./tasks.json')
    .then(tasks => {
    res.render('index', {tasks: tasks})
    })
})

app.use(express.urlencoded({extended:true}))

app.post('/', (req, res) => {
    // task lists data from file
    readFile('./tasks.json',)
        .then((tasks) => {
            // Add new task
            // Create new ID automatically
            let index
            if (tasks.length === 0 ){
                index = 0
            } else {
                index = tasks [tasks.length - 1].id + 1
            }
            // Create Task Object
            const newTask = {
                "id":index,
                "task": req.body.task
            }
            console.log(newTask)
            tasks.push(newTask)
            console.log(tasks)
            data = JSON.stringify(tasks,null, 2)
            console.log(data)
            fs.writeFile ('tasks.json',data,err => {
                if (err) {
                    console.error(err);
                    return
                }else {
                    console.log("saved")
                }
                res.redirect('/')
            })
        } )  
    })
app.get('/delete-task/:taskid', (req, res) => {
    let deletedTaskId = parseInt (req.params.taskid)
        readFile('./tasks.json')
        .then(tasks => {
            tasks.forEach((task, index) => {
                if(task.id === deletedTaskId) {
                    tasks.splice(index, 1)
                }
            })
            data = JSON.stringify(tasks, null, 2)
            fs.writeFile ('./tasks.json', data, 'utf-8', err => {
                if (err) {
                    console.error(err)
                    return;
                }
                // redirect to / to see result
                res.redirect('/')
            })
    })
})
app.get('/delete-tasks', (req,res) => {
    const data = JSON.stringify([],null, 2)
    writeFile ('./tasks.json', data)
    res.redirect('/')
})

app.listen(3001, () =>{
    console.log('Server started at http://localhost:3001')
} )