var mongoose = require('mongoose');

//work schema

var profileSchema = mongoose.Schema({

	username: {
		type: String,
		index:true
	},


	profilePicture:{
		type: String
	}

	

})

var Profile = module.exports = mongoose.model('Profile',profileSchema)
// So that it may be accessible anywhere


