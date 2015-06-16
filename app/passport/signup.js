/**
 * Created by luhuijian on 15/6/15.
 */
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport){
  passport.use('signup',new LocalStrategy({
    // allow us to pass back the entire request to the callback;
    passReqToCallback:true
  },
  function(req, username, password, done){
    findOrCreateUser = function(){
      //find a user in database with privided username
      User.findOne({name : username},function(err,user){
        // in case of any exception ,return using the done method
        if(err){
          consle.log('err signup'+ err);
          return done(err);
        }
        //if user already exists
        if(user){
          console.log('the user is already exists'+ username);
          //because user is already exist,so the credentials is not valid ,
          // using done(null,false) to indicate an authentication failure;
          return done(null,false, req.flash('message','user already exist!'));
        }else{
          //create a user
          var newuser = new User();

              newuser.name = username;
              newuser.password = password;
              // save user
              newuser.save(function (err) {
                if(err){
                  console.log(err);
                }

                console.log('user registration successful!');
                // user registe successful, so credentials are valid! using done(null,newuser)
                return done(null,newuser);
              });
        }
      });
    };
    // Delay the execution of findOrCreateUser and execute the method
    // in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  }

  ));
};
