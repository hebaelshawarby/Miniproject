var mongoose = require('mongoose');

//work schema

var imgSchema = mongoose.Schema({

	username: {
		type: String,
		index:true
	},

	path:{
		type:String
	},

	filename:{
		type: String
	}


})

var Img = module.exports = mongoose.model('Img',imgSchema);



module.exports.getimgs = function(callback,limit){
	Img.find(callback).limit(limit)
}



// add work
module.exports.addimgs = function(img,callback){
	Img.create(img,callback)
}
