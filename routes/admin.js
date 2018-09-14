var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var Admin= require("../models/admin");
var User = require("../models/user");
// Register`
router.get("/register", function(req, res) {
  res.render("register");
});

// Login
router.get("/login", function(req, res) {
  res.render("login");
});

// Register admin
router.post("/register", function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var adminname = req.body.adminname;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Validation
  req.checkBody("name", "Name is required").notEmpty();
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("adminname", "Username is required").notEmpty();
  req.checkBody("password", "Password is required").notEmpty();
  req
    .checkBody("password2", "Passwords do not match")
    .equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    res.render("register", {
      errors: errors
    });
  } else {
    //checking for email and username are already taken
    Admin.findOne(
      {
        adminname: {
          $regex: "^" + adminname + "\\b",
          $options: "i"
        }
      },
      function(err, admin) {
        Admin.findOne(
          {
            email: {
              $regex: "^" + email + "\\b",
              $options: "i"
            }
          },
          function(err, mail) {
            if (admin || mail) {
              res.render("register", {
                admin: admin,
                mail: mail
              });
            } else {
              var newadmin = new Admin({
                name: name,
                email: email,
                adminname: adminname,
                password: password
              });
              Admin.createAdmin(newadmin, function(err, admin) {
                if (err) throw err;
                console.log(admin);
              });
              req.flash("success_msg", "You are registered and can now login");
              res.redirect("/users/login");
            }
          }
        );
      }
    );
  }
});
router.get("/adminedit/:id", (req, res) => {
  Admin.findOne({ _id: req.params.id }).then(user => {
    res.render("adminedit", { user: user });
  });
});

// POST UPDATING

router.put("/adminedit/:id", function(req, res) {
  Admin.update(
    { _id: req.params._id },

    {
      name: req.body.name,
      adminname: req.body.adminname,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    },
    function(err) {
      if (err) throw err;
      else {
        req.flash("success_message", "Profile was successfully updated");

        res.redirect("/adminedit");
      }
    }
  );
});

//delete profile
router.delete("/adminedit/:id", function(req, res) {
  Admin.deleteOne(
    { _id: req.params._id },

    {},
    function(err) {
      if (err) throw err;
      else {
        req.flash("success_message", "Profile was successfully deleted");

        res.redirect("/adminedit");
      }
    }
  );
});

passport.use(
  new LocalStrategy(function(adminname, password, done) {
    Admin.getUserByAdminname(adminname, function(err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: "Unknown User" });
      }

      Admin.comparePassword(password, admin.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid password" });
        }
      });
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Admin.getAdminById(id, function(err, user) {
    done(err, user);
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/admin/login",
    failureFlash: true
  }),
  function(req, res) {
    res.redirect("/");
  }
);

router.get("/logout", function(req, res) {
  req.logout();

  req.flash("success_msg", "You are logged out");

  res.redirect("/admin/login");
});

module.exports = router;
