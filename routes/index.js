var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");


router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'}); 
 });
 
router.post("/register", function(req, res){
    req.body.username
    req.body.password
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser,req.body.password, function(err,user){
        if(err){
            console.log(err);
            //req.flash("error", err);
            res.render("register", {"error": err.message});
            //res.render("register");
        }
        else{
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp " + user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

router.get("/login", function(req, res){
    res.render("login", {page: 'login'});
});

router.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) ,function(req, res){

});

router.get("/logout", function(req, res){
    req.logOut();
    req.flash("success", "you are out!!");
    res.redirect("/");
});

module.exports = router;