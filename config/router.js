/**
 * Created by luhuijian on 15/5/21.
 */

var Blog = require('../app/controllers/blog');
var User = require('../app/controllers/user')

module.exports = function(app){
  //实现逻辑层持久会话
  app.use(function(req,res,next){
    var _user = req.session.user;
    app.locals.user= _user;
    app.locals.msgs = req.flash();
    return next();
  })

  app.get('/blog/new',Blog.new);
  app.get('/logout',User.logout);
  app.post('/user/signin',User.signin);
  app.post('/user/signup',User.signup);
  app.post('/u/:user/blog',Blog.create);
  app.get('/u/:user/blog',Blog.list);
  app.get('/u/:user/blog/:id/edit',Blog.edit);
};
