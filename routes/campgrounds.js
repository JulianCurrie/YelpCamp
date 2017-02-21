var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get('/', function(req, res) {
    Campground.find({}).then(function(savedCampgrounds) {
        res.render("campgrounds/index", {campgrounds: savedCampgrounds});
    }).catch(function(err) {
        console.log(err);
    });
});

router.post('/', function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    
    var newCampground = {
        name: name, 
        image: image, 
        description: description, 
        author: author
    }
    
    Campground.create(newCampground).then(function(campground) {
        res.redirect("/campgrounds");
    }).catch(function(err){
        console.log(err);
    });
});

router.get('/new', isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});

router.get('/:id', isLoggedIn, function(req, res) {
    var promise = Campground.findById(req.params.id).populate("comments").exec();
    
    promise.then(function(foundCampground) {
        console.log(foundCampground);
        res.render("campgrounds/show", {campground: foundCampground});
    }).catch(function(err) {
        console.log(err);
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } 
    
    res.redirect("/login");
}

module.exports = router;