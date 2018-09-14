var express = require("express");
var router = express.Router();
var User = require("../models/user");
// Get Homepage
router.get("/", ensureAuthenticated, function(req, res) {
  
  User.findOne({ _id: req.user.id }).then(user =>
     {
    
    res.render("index", { user: user });
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    //req.flash('error_msg','You are not logged in');
    res.redirect("/users/login");
  }
}





module.exports = router;
