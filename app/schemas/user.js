var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


var UserSchema = new mongoose.Schema({
  name:{
    unique:true,
    type: String
  },
  role:{
    type:Number,
    default:0
  },
  password: String,
  github:{
    id:       String,
    email:    String,
    name:     String
  },
  meta:{
    creatAt:{
      type:Date,
      default:Date.now()
    },
    updateAt:{
      type:Date,
      default:Date.now()
    }
  }
});

UserSchema.pre('save',function(next){
  var user = this;

  if(this.isNew){
    this.meta.creatAt = this.meta.updateAt= Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }
  bcrypt.genSalt(10,function(err,salt){
    if(err) return next(err);
    bcrypt.hash(user.password,salt,function(err,hash){
      if (err) return next(err);
      user.password = hash;
      next();
    })
  })
});

UserSchema.methods.comparePassword = function(_password,cb){
  bcrypt.compare(_password,this.password, function(err,isMathed){
    if(err) {
      console.log(err);
    }
    cb(null,isMathed);
  })
};

UserSchema.statics ={
  fetch: function(cb){
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById:function(id,cb){
    return this
      .findOne({_id: id})
      .exec(cb)
  },
  findOrCreateOAuthUser:function(profile,done){
    var User = this;
    var query = {};
    query[profile.authOrigin+'.id'] = profile.id;
    User.findOne(query,function(err,user){
      if(err) throw err;
      if(user){
        done(null,user)
      }else{
        user ={
          name:profile.username,
          password:'pass'
        }
        user[profile.authOrigin] = {};
        user[profile.authOrigin].id = profile.id;
        user[profile.authOrigin].email = profile.emails[0].value;
        user[profile.authOrigin].name = profile.displayName;

        User.create(
          user,
          function(err, user){
            if(err) throw err;
            done(null, user);
          }
        );
      }
    })
  }

};
 module.exports = UserSchema;



