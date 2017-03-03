var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var User = require('../models/user');
var Work = require('../models/work'); 
var Img = require('../models/img'); 
var Profile = require('../models/profile');
var Portofolio =  require('../models/portofolio');
var AllWork = require('../models/allwork'); 


var multer=require('multer')
var mime=require('mime')
//var upload=multer({dest:'public/uploads'})
var mongoose = require('mongoose');
var db = mongoose.connection; // database object
var fs = require('fs');
var Grid = require('gridfs');
var storage = multer.diskStorage({
	destination: function(req,file,cb){
		cb(null,'./public/uploads')
	},
	filename:function(req,file,cb){
		cb(null,Date.now()+"."+mime.extension(file.mimetype))
	}
});

var upload= multer({dest: __dirname+'/public/uploads/',storage:storage})
var mongoosePaginate = require('mongoose-paginate');

////////////////////////////////////////////////////////////////////////////////


//Portofolios 





router.get('/portofolio', function(req, res){
	res.render('portofolio');
});






router.post('/portofolio',upload.single('work'),function(req,res,next){
		 

		   var username = req.user.username;
		   var name = req.user.name;
			var link = req.body.link;
	        var Title = req.body.Title;
	        var description = req.body.description;
	       // var y=req.files

	       if (req.file){

	       	var filename = req.file.filename
	       	 var newW = new Work({

	        	username:username,
	        	Title:Title,
	        	link:link,
	        	filename:filename
	        })
	       }
	       else {

	       		var newW = new Work({

	        	username:username,
	        	Title:Title,
	        	link:link
	        })

	       }
	       



	        var newPortofolio = new Portofolio({

	        	username:username,
	        	Title:Title,
		        description:description,
		        name:name

	        });

	       

	    

	        newPortofolio.save();
	        newW.save();


	    req.flash('success_msg', 'You now uploaded your work');

		res.redirect('/');





});



//------------------------------------------------------------------------------------------------------------------//













router.get('/n', function(req,res){
	res.render('p')
});



// view profile



router.get('/myprofile', function(req,res,next){
var u= req.user.username
var n=req.user.name
var e= req.user.email
var m= "you currently don't have a profile picture , please upload an image :) "
AllWork.findOne({username:req.user.username},function(	err, doc){
	if(!doc){
		res.render('upload',{
	hbsusername:u,
	hbsname:n,
	hbsemail:e,
	hbsm:m
		} )
	}


	else
	{



var x= doc.profile


res.render('upload',{
	pic:x,
	hbsusername:u,
	hbsname:n,
	hbsemail:e

})

}

})

});





// add profile

router.post('/myprofile',upload.single('myimage'),function(req,res,next){

	var username = req.user.username;
	var filename= req.file.filename

	console.log(filename)
	


	AllWork.findOneAndUpdate({username:username},
	       		 {profile:filename},{safe:true,upsert:true},
	       		function(err,docs){
                if (err) throw err
	       
	       	})


		
	   	res.redirect('/users/myprofile');

})






//---------------------------------------------------------------------------------------------------------









router.get('/work', function(req, res, next) {
  var resultArray = [];

    var cursor = db.collection('works').find();
    cursor.forEach(function(doc, err) {
      resultArray.push(doc);
    }, function() {
      
      res.render('mywork', {items: resultArray});
    });
  
});





router.get('/mywork',function(req,res,next){

res.render('test2')


})


router.get('/kk',function(req,res,next){

		
		

		var resultArray = [];

    var cursor = db.collection('allworks').find();
    cursor.forEach(function(doc, err) {
      resultArray.push(doc);
    }, function() {
      console.log(resultArray)

      res.render('p', {items: resultArray});
    });
    });














router.get('/add',function(req,res,next){

		
		var resultArray = [];

    var cursor = db.collection('allworks').find({username:req.user.username});
    cursor.forEach(function(doc, err) {

      resultArray.push(doc);
    }, function() {
      console.log(resultArray)

      res.render('p', {items: resultArray});
    });
})



////
router.get('/visitor',function(req,res,next){

			

		var resultArray = [];

    var cursor = db.collection('allworks').find();
    cursor.forEach(function(doc, err) {
      resultArray.push(doc);
    }, function() {
      console.log(resultArray)

      res.render('visitor', {items: resultArray});
    });
    });











//

	
//

router.post('/mywork',upload.single('work'),function(req,res){

          var username = req.user.username;
		   var name = req.user.name;
			var link = req.body.link;
	        var title = req.body.Title;
	        var description = req.body.description;

	       // var y=req.files
	       var item;
	    
	       if(req.file){


	       var filename=req.file.filename
	        item={
	       	link:link,
	       	screenshot: filename,
	       	title:title,
	       	description:description
	       }


	        }

	        else
	        {
            item={
	       	link:link,
	       	title:title,
	       	description:description
	       }


	        }
	    
	       	AllWork.findOneAndUpdate({username:username},
	       		{$push: {listOfWork:item}},{safe:true,upsert:true},
	       		function(err,docs){
                if (err) throw err
	       
	       	})

	       
	      


	    req.flash('success_msg', 'You now uploaded your work');

		res.redirect('/');








})









//REGISTRATION AND LOGIN
//////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////





router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	
	res.render('login');
});





// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});


		var newAllworks = new AllWork({
			username:username,
			name:name
		})
		newAllworks.save()


		User.createUser(newUser, function(err, user){
			if(err) throw err;


			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});



passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){

   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			
   				return done(null, user);
   		
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});



router.post('/login', passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}), 
	function(req, res) {
		x=req.user.username;

    res.redirect('/' + x);
    console.log(x)
  }


  );






router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;

 