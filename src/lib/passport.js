const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const dbpool = require("../database");
const helpers = require("./helpers");

passport.use(
  "local.login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const result = await dbpool.query(
        "SELECT * FROM users WHERE email =  ?",
        [email]
      );
      if (result.length > 0) {
        const userInfo = result[0];
        const validPassword = await helpers.matchPassword(
          password,
          userInfo.password
        );
        if (validPassword) {
          done(
            null,
            userInfo,
            req.flash("success", "Welcome ", userInfo.name_first)
          );
        } else {
          done(null, false, req.flash("message", "Password is Wrong"));
        }
      } else {
        return done(null, false, req.flash("message", "User is Wrong"));
      }
    }
  )
);

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const { name_first, name_last } = req.body;
      const newUser = {
        email,
        password,
        name_first,
        name_last,
      };
      const result = await dbpool.query(
        "SELECT * FROM users WHERE email =  ?",
        [email]
      );

      if (result.length > 0) {
        return done(null, false, req.flash("message", "User Exists"));
      } else {
        newUser.password = await helpers.encryptPassword(password);
        const result = await dbpool.query("INSERT INTO users SET ?", [newUser]);
        newUser.id = result.insertId;

        return done(null, newUser, req.flash("success", "SignUp Successfully"));
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const userInfo = await dbpool.query("SELECT * FROM users WHERE id = ?", [id]);
  done(null, userInfo);
});
