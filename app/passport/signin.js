/**
 * Created by luhuijian on 15/6/15.
 */
/**
 * Created by luhuijian on 15/6/15.
 */
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport){
  passport.use('signin',new LocalStrategy({
      // allow us to pass back the entire request to the callback;
      passReqToCallback:true
    },
    function(req, username, password, done){
    User.findOne({name : username},function(err,user){
      if(err){
        return done(err);
      }

      if(!user){
        console.log('user is not found' + username);
        return done(null,false,req.flash('message','user not found!'));
      }else{
        user.comparePassword(password,function(err,isMathed){
          if(err){
            console.log(err);
          }
          if(isMathed){
            req.session.user = user;
            console.log('the password is correct!');
            console.log(req.session.user);
            return done(null, user);
          }else{
            return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
          }
        });
      }
    })

  }));
};
