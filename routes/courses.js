var express = require("express");
var router = express.Router();
var Course = require("../models/course")
var async   = require("async");
var User = require("../models/user");
var middleware = require("../middleware");

router.get("/", function(req, res){
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Course.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCourses) {
            Course.count({name: regex}).exec(function (err, count) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    if (count == 0) {
                       req.flash('error', 'Sorry, no courses match your query. Please try again');
                       return res.redirect('/courses');
                }
                    res.render("courses/index", {
                        courses: allCourses,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        search: req.query.search
                    });
                }
            });
        });
    } else {
        // get all courses from DB
        Course.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCourses) {
            Course.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("courses/index", {
                        courses: allCourses,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        search: false
                    });
                }
            });
        });
    }
});


router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to courses array
    var name = req.body.name;
    var price= req.body.price;
    var image = req.body.image;

    var wistiaID = req.body.wistiaID;
    var desc= req.body.description;
    var author ={
        id:req.user._id,
        username: req.user.username
    }
    var newCourse = { name: name, price: price, image: image, wistiaID: wistiaID, description : desc, author:author}
    //Create a new course and save to DB
    Course.create(newCourse, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            
            //redirect back to courses page
            console.log(newlyCreated)
            res.redirect("/courses")
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("courses/new");
});

router.get("/become-teacher", middleware.isLoggedIn, function(req, res){
    res.render("courses/become-teacher");
});

//shows more info about a course
router.get("/:id", function(req, res){
    // FIND THE COURSE WITH PROVIDED ID
    Course.findById(req.params.id).populate("comments").exec(function(err, foundCourse){
        if(err){
            console.log(err);
        } else {
            //RENDER SHOW TEMPLATE WITH THAT COURSE
            res.render("courses/show", {course: foundCourse});
        }
        
    });
});

router.get("/:id/playlist", middleware.checkCoursePurchase, function(req, res){
    Course.findById(req.params.id).populate("comments").exec(function(err, foundCourse){
        if(err){
            console.log(err);
        } else {
            res.render("courses/playlist", {course: foundCourse});
        }
        
    });
});

//edit course route
router.get("/:id/edit", middleware.checkCourseOwnership, function(req, res) {
        Course.findById(req.params.id, function(err, foundCourse){
                res.render("courses/edit", {course: foundCourse});
         });
});

//update course route
router.put("/:id", function(req, res){
    // find and update the correct course
    Course.findByIdAndUpdate(req.params.id, req.body.course, function(err, updatedCourse){
       if(err){
           res.redirect("/courses");
       } else {
           //redirect somewhere(show page)
           res.redirect("/courses/" + req.params.id);
       }
    });
});

//DESTROY COURSE ROUTE
router.delete("/:id", middleware.checkCourseOwnership, function(req, res){
   Course.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/courses");
      } else {
          req.flash("error", "Course deleted!")
          return res.redirect("/courses");
      }
   });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
module.exports = router;