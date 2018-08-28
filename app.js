var resetDatabase = 0; // 1 for resetting the database on server initialization

//main imports
var bodyParser       = require('body-parser'),
    expressSanitazer = require('express-sanitizer'),
    mongoose         = require('mongoose'),
    passport         = require('passport'),
    localStrategy    = require('passport-local'),
    flash            = require('connect-flash'),
    methodOverride   = require('method-override'),
    seedDB           = require('./seeds'),
    User             = require('./models/user'),
    express          = require('express'),
    app              = express();

//importing routes
var campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes    = require('./routes/comments'),
    indexRoutes      = require('./routes/index');

//database set up
if (resetDatabase) seedDB();
mongoose.connect(process.env.YELPCAMPDB, {
  useNewUrlParser: true
});

//app configurations
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + "/public")); //for better file name handling
app.use(expressSanitazer());
app.set("view engine", "ejs"); //dinamic HTML technology
app.use(methodOverride("_method"));
app.use(flash());

//passport configuration
app.use(require("express-session")({
  secret: "Once again Rusty wins cutest dog award",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passing arguments to all routes
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
})

//setting routes
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT, () => {
  console.log("YELPCAMP SERVER RUNNING");
  if (resetDatabase) console.log("SEEDING...");
}); //process.env.PORT is needed for dinamically assigned ports



