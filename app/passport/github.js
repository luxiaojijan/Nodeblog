/**
 * Created by luhuijian on 15/6/16.
 */
var GithubStrategy = require('passport-github').Strategy;
var User = require('../models/user');

module.exports = function(passport){
  passport.use('github',new GithubStrategy({
      clientID: 'f4967c34aa7dddd39526',
      clientSecret: '589b238d69c3c26ab4f7a837e7cd60f25a6c9855',
      callbackURL: 'http://localhost:4000/auth/github/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      profile.authOrigin = 'github';
      console.log(profile);
      User.findOrCreateOAuthUser(profile, function (err, user) {
        return done(err, user);
      });
    }
  ));
};
