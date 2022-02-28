const express = require("express");
const router = express.Router();
const dbpool = require("../database");
const { isLoggedIn } = require("../lib/auth");

router.get("/add", isLoggedIn, (req, res) => {
  res.render("folders/add");
});

router.post("/add", isLoggedIn, async (req, res) => {
  const { folder_name } = req.body;
  const newFolder = {
    folder_name,
    user_id: req.user[0].id
  };
  
  await dbpool.query("INSERT INTO folders set ?", [newFolder]);
  req.flash("success", "Folder Saved Successfully");
  res.redirect("/api/folders");
});

router.get("/", isLoggedIn, async (req, res) => {
  const foldersList = await dbpool.query("SELECT * FROM folders WHERE user_id = ?",[req.user[0].id]);
  res.render("folders/list", { foldersList });
});

router.get("/delete/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await dbpool.query("DELETE FROM folders WHERE id = ?", [id]);
  await dbpool.query("DELETE FROM tasks WHERE folder_id = ?", [id]);

  req.flash("success", "Folder and included Tasks Deleted Successfully");
  res.redirect("/api/folders");
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const folderInfo = await dbpool.query("SELECT * FROM folders WHERE id = ?", [
    id,
  ]);
  res.render("folders/edit", { folderEdit: folderInfo[0] });
});

router.post("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { folder_name } = req.body;
  const updatedFolder = {
    folder_name,
  };
  await dbpool.query("UPDATE folders set ? WHERE id = ?", [updatedFolder, id]);
  req.flash("success", "Folder Updated Successfully");
  res.redirect("/api/folders");
});

module.exports = router;
