var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware");
var Comment = require("../models/comment");

router.get("/new",middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, found){
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("comments/new", {campground:found});
        }
    });
   
});

router.post("/",middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err)
        {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            Comment.create(
                req.body.comment, function(err, comment){
                    if(err)
                    {
                        console.log(err);
                        req.flash("error", "There is an issue adding comments");
                        res.redirect("/campgrounds/"+campground._id);
                    }
                    else{
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        comment.save();
                        campground.comments.push(comment);
                        campground.save();
                        req.flash("success", "Comment added successfully");
                        res.redirect("/campgrounds/"+campground._id);
                    }
                });
        }
    });
});

router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){

    Comment.findById(req.params.comment_id, function(err, foundComment){

        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {campground_id:req.params.id, comment:foundComment });
        }
    });    
   
});

router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){

    Campground.findById(req.params.id,function(err, foundC){
        if(err || !foundC)
        {
            req.flash("error", "There is an issue loading campground or the comments");
            console.log(err);
            return res.redirect("back");
        }
        else{
            Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){

                if(err){
                    res.redirect("back");
                }else{
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });
        }
        
    });
});

router.delete( "/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){

        if(err){
            req.flash("error", "There is an issue deleting comments");
            res.redirect("back");
        }else{
            req.flash("error", "That horid comment is gone for life");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });  
});


module.exports = router;