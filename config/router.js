/**
 * Created by luhuijian on 15/5/21.
 */
var express = require('express');
var app = express();
var formidable = require('formidable');
var router = express.Router();

var Blog = require('../app/controllers/blog');
var User = require('../app/controllers/user')

module.exports = function(passport){
  //实现逻辑层持久会

  router.get('/',Blog.index);
  router.get('/blog/new',Blog.new);
  router.get('/logout',User.logout);

  // handle signin post
  router.post('/user/signin',passport.authenticate('signin',{
    successRedirect:'/blog/new',
    failureRedirect: '/'
  }));

  // handle signup post
  router.post('/user/signup',passport.authenticate('signup',{
    successRedirect:'/blog/new',
    failureRedirect: '/',
    failureFlash:true
  }));

  // handle github get
  router.get("/auth/github", passport.authenticate("github",{ scope : "email"}));

  router.get("/auth/github/callback",
    passport.authenticate("github",{ failureRedirect: '/'}),
    function(req,res){
      res.render("new", {user : req.user});
    }
  );

  router.post('/u/:user/blog',Blog.create);
  router.get('/u/:user/blog',Blog.list);
  router.get('/u/:user/blog/:id', Blog.show);
  router.post('/u/:user/blog/:id', Blog.update);
  router.get('/u/:user/blog/:id/edit',Blog.edit);

  return router;
};
