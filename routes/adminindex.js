var express = require('express');
var router = express.Router();
var Role = require('../models/admin');
// Get Homepage


	


	router.get('/', function(req, res, next) {
		passport.authenticate('bearer', function(err, user) {
		  
			if (user.role === 'admin'){
			  return User.find({}).then(name=>{
				res.render('adminindex',{name:name});
				
	   });
			}else
			{
			  
		
			User.findOne({ _id: req.user._id }).then(user => {
    
				res.render("index", { user: user });
		
		});
	} 
});
			
});



module.exports = router;