
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const TodoTask = require('./models/todoTask')
const methodOverride = require("method-override");



mongoose.connect('mongodb://localhost:27017/TodoTask', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(methodOverride("_method"));



// const addDone = () => {
//     const element = document.querySelector(".list-item.name");
//     element.classList.toggle("done");
// }

const t1 = new TodoTask({ content: "add to-do  👆🏻" })
const t2 = new TodoTask({ content: " update them 👉🏻" })
const t3 = new TodoTask({ content: " remove them, once done 🤖" })

const addDef = [t1, t2, t3];


app.get("/", async (req, res) => {
    const todo = await TodoTask.find({});
    if (todo.length === 0) {
        const todo = await TodoTask.insertMany(addDef);
        res.render('index', { todo })
    }
    res.render('index', { todo })
})

app.post("/", async (req, res) => {
    const todo = new TodoTask(req.body.todo);
    await todo.save();
    res.redirect(`/`);
});


app.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const todo = await TodoTask.find({});
    const current_edit = await TodoTask.findById(id);
    res.render('edit', { current_edit, id, todo });
})


app.post('/edit/:id', (req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

app.listen(3000, () => {
    console.log(" server started at 3000 port ");
});
