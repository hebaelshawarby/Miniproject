var mongoose = require('mongoose');



var portofolioSchema = mongoose.Schema({

	username: {
		type: String

	},

	name:{
		type:String
	},

	picPath:{
		type: String
	},

	

	picfileName:{
		type: String
	},



	Title:{
		type:String,
		required:true,
		unique:true
	},

	description : {

		type: String
	}

})

var Portofolio = module.exports = mongoose.model('Portofolio',portofolioSchema)
// So that it may be accessible anywhere
  
// get the work 

module.exports.getportofolio = function(callback,limit){
	Work.find(callback).limit(limit)
}



// add work
module.exports.addportofolio = function(portofolio,callback){
	Portofolio.create(portofolio,callback)
}
