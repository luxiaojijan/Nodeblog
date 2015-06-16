var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dbUrl = 'mongodb://127.0.0.1:27017/myblog2';
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);

var User = require('./app/models/user');

var app = express();

mongoose.connect(dbUrl);
// view engine setup
app.set('views', path.join(__dirname, './app/views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(session({
  secret: 'myblog2',
  store: new mongoStore({
    url:dbUrl,
    collection: 'sessions'
  })
}));

//configuring passport
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

//using flash middleware provideed by connect-flash to store message in session
//and displaying in templates
var flash = require('connect-flash');
app.use(flash());

//Initialize Passport
var initpassport = require('./app/passport/init');
initpassport(passport);

// use serve-favicon middleware to set favicon for your web application
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/favicon.ico'));


// setting router
var routes = require('./config/router')(passport);
app.use(function(req,res,next){
  console.log(req.method,req.url);
  var _user = req.session.user;
  app.locals.user= _user;
  app.locals.msgs = req.flash();
  next();
});
app.use('/',routes);



//setting ueditor for nodejs

var ueditor = require('ueditor-nodejs');
app.use('/ueditor/ue', ueditor({//这里的/ueditor/ue是因为文件件重命名为了ueditor,如果没改名，那么应该是/ueditor版本号/ue
  configFile: '/ueditor/nodejs/config.json',
  mode: 'bcs', //本地存储填写local
  accessKey: 'Adxxxxxxx',//本地存储不填写，bcs填写
  secrectKey: 'oiUqt1VpH3fdxxxx',//本地存储不填写，bcs填写
  staticPath: path.join(__dirname, 'public'), //一般固定的写法，静态资源的目录，如果是bcs，可以不填
  dynamicPath: '/blogpicture' //动态目录，以/开头，bcs填写buckect名字，开头没有/.路径可以根据req动态变化，可以是一个函数，function(req) { return '/xx'} req.query.action是请求的行为，uploadimage表示上传图片，具体查看config.json.
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
