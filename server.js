const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public")); // your HTML/JS/CSS files

const TASK_FILE = "./tasks.json";

// GET all tasks
app.get("/tasks", (req, res) => {
    const tasks = JSON.parse(fs.readFileSync(TASK_FILE));
    res.json(tasks);
});

// SAVE tasks
app.post("/tasks", (req, res) => {
    const tasks = req.body;
    fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2));
    res.json({ status: "success" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
