const express = require("express");
const router = express.Router();
const passport = require("passport");
const dbpool = require("../database");
const helpers = require("../lib/helpers");
const { isLoggedIn, isLoggedAlready } = require("../lib/auth");

router.get("/signup", isLoggedAlready, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", passport.authenticate("local.signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

router.get("/login", isLoggedAlready, (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local.login", {
    successRedirect: "/api/folders",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile");
});

router.get("/logout", (req, res) => {
  req.logOut();
  delete req.user;
  delete userInfo;
  res.redirect("/login");
});

router.post("/update/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  const savedUser = await dbpool.query("SELECT * FROM users WHERE email =  ?", [
    updatedUser.email,
  ]);
  if (
    updatedUser.password != "" ||
    savedUser[0].name_first != updatedUser.name_first ||
    savedUser[0].name_first != updatedUser.name_first
  ) {
    if (updatedUser.password == "") {
      updatedUser.password = savedUser[0].password;
    } else {
      updatedUser.password = await helpers.encryptPassword(
        updatedUser.password
      );
    }
    await dbpool.query("UPDATE users set ? WHERE id = ?", [updatedUser, id]);
    req.flash("success", "Profile Updated Successfully");
  } else {
    req.flash("success", "Profile not Changed");
  }
  res.redirect("/api/tasks");
});

module.exports = router;
