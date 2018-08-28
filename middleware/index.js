//all middleware
var Campground = require('../models/campground');
var Comments = require('../models/comment');
var showErrMsgPerm = function(req) {req.flash("error", "You dont have permission to do that");}
var showErrMsgLogin = function(req) {req.flash("error", "You need to login first!");}
var showErrMsgUnk = function(req,err) {req.flash("error:", err.message);}

middlewareObj = {
    //middleware function for login check(extra layer)
    checkCampgroundOwnership: function (req, res, next) {
        if (req.isAuthenticated()) {
            Campground.findById(req.params.id, function (err, foundCampground) {
                if (err || !foundCampground) {
                    showErrMsgUnk(req,err);
                    console.log(err);
                    res.redirect("back");
                }
                else {
                    if (foundCampground.author.id.equals(req.user.id)) next();
                    else{
                        showErrMsgPerm(req);
                        res.redirect("back");
                    }
                }
            });
        }
        else {
            showErrMsgLogin(req);
            res.redirect("back");
        }
    },
    //middleware function for login check(extra layer)
    checkCommentOwnership: function (req, res, next) {
        if (req.isAuthenticated()) {
            Comments.findById(req.params.comment_id, function (err, foundComment) {
                if (err || !foundComment) {
                    showErrMsgUnk(req,err);
                    console.log(err);
                    res.redirect("back");
                }
                else {
                    if (foundComment.author.id.equals(req.user.id)) next();
                    else{
                        showErrMsgPerm(req);
                        res.redirect("back");
                    }
                }
            });
        }
        else {
            showErrMsgLogin(req);
            res.redirect("back");
        } 
    },

    //aux function for login check
    isLoggedIn: function (req, res, next) {
        if (req.isAuthenticated()) return next();
        showErrMsgLogin(req);
        res.redirect("/login");
    },

    //aux callback
    emptyCallback : function (req, res) {}
}

module.exports = middlewareObj;