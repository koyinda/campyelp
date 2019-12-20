var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

router.get("/", function(req, res){
    //res.send("ok");
    Campground.find({}, function(err, acampgrounds){
        if(err)
        {
            console.log(err);
        }
        else{
            //console.log(acampgrounds);
            res.render("campgrounds/index", {campgrounds:acampgrounds, page: 'campgrounds'});
        }
    });
    //res.render("campgrounds", {campgrounds:campgrounds});
});

router.post("/",middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var des = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          console.log("err");
          return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newCampground = {
            name: name, 
            image: image,
            price: price, 
            description: des, 
            author:author,
            location: location,
            lat: lat,
            lng: lng
        }
        Campground.create(
        newCampground, function(err, newlyCreated){
            if(err)
            {
                console.log(err);
                req.flash("error", "There is an issue creating campground");
            }
            else{
                req.flash("success", "Campground created successfully");
                res.redirect("/campgrounds");
            }

        });
    });
});

router.get("/new",middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, found){
        if(err || !found)
        {
            req.flash("error", "There is an issue loading campground or the comments");
            console.log(err);
            res.redirect("back");
        }
        else{
            res.render("campgrounds/show", {campground:found});
        }
    });
   
});
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){

    Campground.findById(req.params.id, function(err, foundCampground){
        
        res.render("campgrounds/edit", {campground:foundCampground});
            
    });
    //res.render("campgrounds/edit", {campground:found});
});

router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){

    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedC){
            if(err)
            {
                console.log(err);
                req.flash("error", err.message);
                res.redirect("/campgrounds");
            }
            else{
                res.redirect("/campgrounds/"+req.params.id);
            }
        });
    });
    //res.render("campgrounds/edit", {campground:found});
});

router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, updatedC){
        if(err)
        {
            console.log(err);
            req.flash("error", "There is an issue deleting campground");
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success", "that ridiculous campground is gone");
            res.redirect("/campgrounds");
        }
    });

});

module.exports = router;