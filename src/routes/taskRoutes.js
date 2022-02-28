const express = require("express");
const router = express.Router();
const dbpool = require("../database");
const { isLoggedIn } = require("../lib/auth");

router.get("/", isLoggedIn, async (req, res) => {
  const tasksList = await dbpool.query(
    "SELECT tasks.id as id, tasks.task_title, tasks.task_done, folders.id as folder_id, folders.folder_name  FROM tasks INNER JOIN folders on folders.id = tasks.folder_id WHERE tasks.user_id = ?",
    [req.user[0].id]
  );
  res.render("tasks/list", { tasksList });
});

router.get("/tasksbyfolder/:recievedParams", isLoggedIn, async (req, res) => {
  const { recievedParams } = req.params;
  folderInfo = recievedParams.split("+");
  folderName = folderInfo[1];
  folderId = folderInfo[0];
  const tasksList = await dbpool.query(
    "SELECT tasks.id as id, tasks.task_title, tasks.task_done, folders.id as folder_id, folders.folder_name  FROM tasks INNER JOIN folders on folders.id = tasks.folder_id WHERE tasks.folder_id = ?",
    [folderInfo[0]]
  );
  res.render("tasks/listbyfolder", { folderId, folderName, tasksList });
});

router.get("/add/:folder_id", isLoggedIn, (req, res) => {
  const { folder_id } = req.params;
  res.render("tasks/add", { folder_id });
});

router.post("/add/:recievedParams", isLoggedIn, async (req, res) => {
  const { recievedParams } = req.params;
  folderInfo = recievedParams.split("+");
  folderName = folderInfo[1];
  folderId = folderInfo[0];

  const { task_title } = req.body;
  const newTask = {
    task_title,
    user_id: req.user[0].id,
    folder_id: folderId,
  };

  await dbpool.query("INSERT INTO tasks set ?", [newTask]);
  req.flash("success", "Task Saved Successfully");

  res.redirect("/api/tasks/tasksbyfolder/" + recievedParams);
});

router.get("/delete/:recievedParams", isLoggedIn, async (req, res) => {
  const { recievedParams } = req.params;
  folderInfo = recievedParams.split("+");
  taskId = folderInfo[0];
  folderId = folderInfo[1];
  folderName = folderInfo[2];
  sendParams = folderId + "+" + folderName

  await dbpool.query("DELETE FROM tasks WHERE id = ?", [taskId]);
  req.flash("success", "Task Deleted Successfully");
  res.redirect("/api/tasks/tasksbyfolder/" + sendParams);
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const taskInfo = await dbpool.query("SELECT * FROM tasks WHERE id = ?", [id]);
  res.render("tasks/edit", { taskEdit: taskInfo[0] });
});

router.post("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  let { task_title, task_done } = req.body;

  if (typeof task_done === "undefined") {
    task_done = 0;
  } else {
    task_done = 1;
  }

  const updatedTask = {
    task_title,
    task_done,
  };
  await dbpool.query("UPDATE tasks set ? WHERE id = ?", [updatedTask, id]);
  req.flash("success", "Task Updated Successfully");
  res.redirect("/api/tasks");
});

router.get("/inlistedit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  let { task_title, task_done } = req.body;
  const taskInfo = await dbpool.query("SELECT * FROM tasks WHERE id = ?", [id]);

  if (taskInfo[0].task_done == 0) {
    taskInfo[0].task_done = 1;
  } else {
    taskInfo[0].task_done = 0;
  }

  const updatedTask = {
    task_title: taskInfo[0].task_title,
    task_done: taskInfo[0].task_done,
  };

  await dbpool.query("UPDATE tasks set ? WHERE id = ?", [updatedTask, id]);
  res.redirect("/api/tasks");
});

module.exports = router;
