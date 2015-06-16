/**
 * Created by luhuijian on 15/5/21.
 */
var User = require('../models/user');


exports.signup = function(req,res){
  var _user = req.body.user;
  console.log(_user);
  var user = new User(_user);
  user.save(function(err,user){
    if(err){
      console.log(err);
    }
    res.redirect('/blog/new')
  })
};

exports.signin = function(req,res){
  var _user = req.body.user;
  var name = _user.name;
  var password = _user.password;
  User.findOne({name:name},function(err,user){
    if(!user){
      console.log('the user is not exit!');
      res.redirect('/');
    }else{
      user.comparePassword(password,function(err,isMathed){
        if(err){
          console.log(err);
        }
        if(isMathed){
          req.session.user = user;
          console.log('the password is correct!');
          console.log(req.session.user);
          res.redirect('/blog/new');
        }else{
          console.log('the password is false!');
        }
      })
    }
  })
};

exports.logout = function(req,res){
  delete req.session.user;
  res.redirect('/blog/new');
}

