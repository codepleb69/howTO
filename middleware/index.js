var Course = require("../models/course");
var Comment = require("../models/comment");
var Comment = require("../models/user");
var async   = require("async");
var middlewareObj = {};

middlewareObj.checkCourseOwnership = function (req, res, next){
         if(req.isAuthenticated()){
             
                Course.findById(req.params.id, function(err, foundCourse){
                 if(err){
                     req.flash("error", "Course not found");
                     res.redirect("back")
                 } 
                 if (!foundCourse) {
                     return res.status(400).send("Item not found.")
                 } else {
                     //does user own the course?
                     if(foundCourse.author.id.equals(req.user._id) || req.user.isAdmin){
                          next();
                     } else {
                         req.flash("error", "You don't have permission!")
                         res.redirect("back");
                     }
                 }
             });
             //otherwise redirect 
        } else {
            req.flash("error", "You need to be logged in!")
            res.redirect("back");
        }
}


middlewareObj.checkCoursePurchase = function (req, res, next){
         if(req.isAuthenticated()){
                var purchased;
                Course.findById(req.params.id, function(err, foundCourse){
                     var check = req.user.coursesTaken.forEach(function(foundCourses){
                        if(req.params.id ==foundCourses.course){
                            purchased=  true;   
                        } else {
                            purchased = false;
                        }
                        return purchased;
                    });

                 if(err){
                     req.flash("error", "Course not found");
                     res.redirect("back")
                 } 
                 if (!foundCourse) {
                     return res.status(400).send("Item not found.")
                 } else {
                     //does user own the course?
                     if(foundCourse.author.id.equals(req.user._id) || req.user.isAdmin || purchased ){
                          next();
                     } else {
                         req.flash("error", "You need to purchase this course first!")
                         res.redirect("back");
                     }
                 }
             });
             //otherwise redirect 
        } else {
            req.flash("error", "You need to be logged in!")
            res.redirect("back");
        }
}


middlewareObj.checkCommentOwnership = function (req, res, next){
        if(req.isAuthenticated()){
             
            Comment.findById(req.params.comment_id, function(err, foundComment){
                 if(err){
                     res.redirect("back")
                 } else {
                     //does user own the course?
                     if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                          next();
                     } else {
                         req.flash("error", "You don't have permission!")
                         res.redirect("back");
                     }
                 }
             });
             //otherwise redirect 
        } else {
            req.flash("error", "You need to be logged in!")
            res.redirect("back");
        }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in!")
    res.redirect("/login");
}


module.exports = middlewareObj;