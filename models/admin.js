var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
// admin Schema
var RoleSchema = mongoose.Schema({
	role:['admin','user']
		
	}
);
var Role = module.exports = mongoose.model('role', RoleSchema);
module.exports.getAdminByRole = function(role, callback){
	var query = {role: admin};
	Role.findOne(query, callback);
}


