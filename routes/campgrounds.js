//imports
var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var middleware = require('../middleware');

//INDEX ROUTE
router.get("/", function (req, res) {
    Campground.find({}, function (err, camp) {
        if (err) console.log(err);
        else res.render("campgrounds/index", {
            campgrounds: camp
        });
    })
});

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function (req, res) {
    var newCampground = req.body.campground;
    //description sanitizing
    newCampground.description = req.sanitize(newCampground.description);

    Campground.create(newCampground,
        function (err, newCamp) {
            if (err) req.flash("error", err.message);
            else {
                //add user data
                newCamp.author.username = req.user.username;
                newCamp.author.id = req.user.id;
                newCamp.save();
                //redirect to index 
                req.flash("success", "Campground Created");
                res.redirect("/campgrounds");
            }
        }
    );
});

//SHOW ROUTE
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err || !foundCampground) console.log(err);
        else res.render("campgrounds/show", {
            campground: foundCampground
        });
    });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground) console.log(err);
        else res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE ROUTE
router.put("/:id" , middleware.checkCampgroundOwnership, function(req, res) {
    var updatedCampground = req.body.campground;
    //description sanitizing
    updatedCampground.description = req.sanitize(updatedCampground.description);

    Campground.findByIdAndUpdate(req.params.id, updatedCampground, function(err){
        if(err || !updatedCampground) req.flash("error", err.message);
        else  {
            req.flash("success", "Campground Edited Successfully");
            res.redirect("/campgrounds/" + req.params.id );
        }
    });
});

//DESTROY ROUTE
router.delete("/:id" , middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndDelete(req.params.id, function(err){
        if(err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else  {
            req.flash("error", "Campground Deleted");
            res.redirect("/campgrounds/");
        }
    });
});

module.exports = router;