var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
//work schema

var allworkSchema = mongoose.Schema({

	username: {
		type: String,
		unique:true
	},

	name:{
		type:String
	},

	profile:{
		type:String
	},

	listOfWork:[{
		link:String,
		screenshot: String,
		description: String,
		title:String
	}],

	

})
allworkSchema.plugin(mongoosePaginate);
var AllWork = module.exports = mongoose.model('AllWork',allworkSchema)
// So that it may be accessible anywhere
  