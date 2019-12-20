var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {

};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground)
            {
                console.log(err);
                req.flash("error", "There is an issue loading campground");
                res.redirect("back");
            }
            else{
                if(foundCampground.author.id.equals(req.user._id))
                {
                    next()
                }
                else{
                    req.flash("error", "ok.. you dont have permission to do that!");
                    res.redirect("back");
                }
                
            }
        });
    }else{
        req.flash("error", "ok.. you gotta login first!");
        res.redirect("back");
    }

}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err|| !foundComment)
            {
                console.log(err);
                req.flash("error", "There is an issue loading comments");
                res.redirect("back");
            }
            else{
                if(foundComment.author.id.equals(req.user._id))
                {
                    next()
                }
                else{
                    console.log(err);
                    req.flash("error", "you dont have permission to do that");
                    res.redirect("back");
                }
                
            }
        });
    }else{
        console.log("you need to be logged in!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "ok.. you gotta login first!");
    res.redirect("/login");
}

module.exports = middlewareObj;