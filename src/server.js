// Requirements
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const exphbs = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
const MySQLStore = require("express-mysql-session");
const passport = require("passport");
const { database } = require("./keys");
const { userInfo } = require("os");

// Initializations
const app = express();
require("./lib/passport");

// Settings
app.set("port", process.env.PORT || 3000); //Toma el puerto del SO sino lo estable a 3000
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./lib/handlebars"),
  })
);
app.set("view engine", ".hbs");

// Middlewares
app.use(
  session({
    secret: "@to&do#list$session",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database),
  })
);
app.use(flash());
app.use(express.json()); // Se asegura que la info que recibimos es json
app.use(express.urlencoded({ extended: false })); // Deja aceptar los datos que vienen de los formularios por URL
app.use(morgan("dev")); // Muestra informacion de las peticiones en la consola del servidor
// GET / 404 3.588 ms - 139   => accion ruta mensage|error tiempo peso
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req, res, next) => {
  app.locals.success = req.flash("success");
  app.locals.message = req.flash("message");
  if (typeof req.user !== "undefined") {
    app.locals.userInfo = req.user[0];
  } else {
    delete userInfo;
  }
  next();
});

// Routes
app.use(require("./routes/index"));
app.use(require("./routes/authenticationRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/folders", require("./routes/folderRoutes"));

// Public Files - Client
app.use(express.static(path.join(__dirname, "public")));

// Start Server
app.listen(app.get("port"), () => {
  console.log(`SERVER PORT : ${app.get("port")}`);
});
