var  express        = require("express"),
     app            = express(),
     bodyParser     = require("body-parser"),
     mongoose       = require("mongoose"),
     passport       = require("passport"),
     flash          = require("connect-flash"),
     LocalStrategy  = require("passport-local"),
     methodOverride = require("method-override"),
     Course         = require("./models/course"),
     Comment        = require("./models/comment"),
     User           = require("./models/user"),
     morgan = require('morgan');
     seedDB         = require("./seeds");
     
//requiring routes     
var commentRoues     = require("./routes/comments"),
    courseRoutes     = require ("./routes/courses"),
    indexRoutes      = require("./routes/index"),
    paymentRoutes    = require("./routes/payment")

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(morgan('dev'));

//mlab user alex4ce pass Kappa123
mongoose.connect("mongodb://root:abc123@ds161780.mlab.com:61780/cojandb");
//seedDB(); 
app.locals.moment = require('moment');

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "stay strong!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware calls on every route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/courses", courseRoutes);
app.use("/courses/:id/payment", paymentRoutes);
app.use("/courses/:id/comments", commentRoues);


app.listen(8080, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Running on port 8080");
  }
});
