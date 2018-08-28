var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comments = require('../models/comment');
var middleware = require('../middleware');

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err || !foundCampground) console.log(err);
        else res.render("comments/new", {
            campground: foundCampground
        });
    });
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function (req, res) {
    //comment text sanitizing
    req.body.comment.text = req.sanitize(req.body.comment.text);
    var newComment = req.body.comment;

    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err || !foundCampground) redirect("/campgrounds");
        else {
            Comments.create(newComment, function (err, createdComment) {
                if (err) req.flash("error", err.message);
                else {
                    //add username and id to comment
                    createdComment.author.id = req.user.id;
                    createdComment.author.username = req.user.username;
                    //save comment
                    createdComment.save();
                    //add comments to database
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    req.flash("success", "Comment Added!!");
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            })
        };
    });
});

//EDIT ROUTE
router.get("/:comment_id/edit" , middleware.checkCommentOwnership,  function(req, res) {
    Comments.findById(req.params.comment_id, function (err, foundComment) {
        if (err || !foundComment) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else res.render("comments/edit", {
            comment: foundComment,
            campID: req.params.id
        });
    });
});

//UPDATE ROUTE
router.put("/:comment_id" , function(req, res) {
    var updatedComment = req.body.comment;
    //comment sanitizing
    updatedComment.text = req.sanitize(updatedComment.text);
    
    Comments.findByIdAndUpdate(req.params.comment_id, updatedComment, function(err){
        if(err || !updatedComment) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment Edited Successfully");
            res.redirect("/campgrounds/" + req.params.id );
        }
    });
});

//DESTROY ROUTE
router.delete("/:comment_id" , middleware.checkCommentOwnership,  function(req, res) {
    Comments.findByIdAndDelete(req.params.comment_id, function(err){
        if(err) {
            req.flash("error", err.message);
            console.log(err);
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment Deleted");
            res.redirect("back");}
    });
});

module.exports = router; 