require('dotenv').config();
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//var Campground = require("./models/campground");
//var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
var passport = require("passport");
var flash = require("connect-flash");
var methodOverride = require("method-override");
var LocalStrategy = require("passport-local");
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campground");
var indexRoutes = require("./routes/index");
//var passportLocalMongoose = require("passport-local-mongoose");

//seedDB();

app.use(flash());
app.use(require("express-session")({
    secret: "Awesomeness is an art",
    resave: false,
    saveUninitialized: false
}));
app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//console.log(process.env.DATABASEURL);
//mongoose.connect("mongodb://localhost/yelpCamp", { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
//mongoose.connect("mongodb://localhost/yelpCamp", { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
mongoose.connect(process.env.DATABASEURL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });


//process.env.databaseURL
//mongodb+srv://koyinda:<password>@cluster0-2eotf.mongodb.net/test?retryWrites=true&w=majority

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next){
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.cUser = req.user;
  next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

// Campground.create(
//     {name: "Big Pond Garden", 
//     image: "https://images.unsplash.com/photo-1560903212-5af23c9f9534?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80",
//     description: "For those who have seen the Earth from space, and for the hundreds and perhaps thousands more who will, the experience most certainly changes your perspective. The things that we share in our world are far more valuable than those which divide us."
// }
// , function(err, campground){
//         if(err)
//         {
//             console.log(err);
//         }
//         else{
//             console.log(campground);
//         }

// });

// app.get("/", function(req, res){
//     res.render("landing");
// });

// app.get("/register", function(req, res){
//     res.render("register");
// });

// app.post("/register", function(req, res){
//     req.body.username
//     req.body.password
//     var newUser = new User({
//         username: req.body.username
//     });
//     User.register(newUser,req.body.password, function(err,user){
//         if(err){
//             console.log(err);
//             res.render("register");
//         }
//         else{
//             passport.authenticate("local")(req, res, function(){
//                 res.redirect("/campgrounds");
//             });
//         }
//     });
// });

// app.get("/login", function(req, res){
//     res.render("login");
// });

// app.post("/login",passport.authenticate("local",{
//     successRedirect: "/campgrounds",
//     failureRedirect: "/login"
// }) ,function(req, res){

// });

// app.get("/logout", function(req, res){
//     req.logOut();
//     res.redirect("/");
// });

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("The Yelp Camp Server Has Started!");
});