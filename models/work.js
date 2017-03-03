var mongoose = require('mongoose');

//work schema

var workSchema = mongoose.Schema({

	username: {
		type: String,
		index:true
	},

	Title:{
		type:String
	},

	link:{
		type: String
	},

	filename : {

		type: String
	}
	,

	path : {

		type: String
	}


})

var Work = module.exports = mongoose.model('Work',workSchema)
// So that it may be accessible anywhere
  
// get the work 

module.exports.getWorks = function(callback,limit){
	Work.find(callback).limit(limit)
}



// add work
module.exports.addWorks = function(work,callback){
	Work.create(work,callback)
}
