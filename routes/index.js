var express = require('express');
var router = express.Router({mergeParams: true});
var passport = require('passport');
var User = require('../models/user');
var middleware = require('../middleware');

//Main page
router.get("/", function (req, res) {
    res.render("landing");
});

//Registration form
router.get("/register", function (req, res) {
    res.render("register");
});

//Registration logic
router.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username
    });
    var password = req.body.password;

    User.register(newUser, password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("sucess", user.username + "registered successfully");
            res.redirect("/campgrounds");
        });
    });
});

//Login form
router.get("/login", function (req, res) {
    res.render("login");
});

//login logic
router.post("/login", 
    passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Login Successful"
    }),
     middleware.emptyCallback);

//logout logic
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success","Logged Out!");
    res.redirect("back");
});

module.exports = router;