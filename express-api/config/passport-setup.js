// const passport = require("passport")
// const FacebookStrategy = require("passport-facebook").Strategy
// const User = require('../models').User

// const dotenv = require("dotenv")
// dotenv.config()

// passport.serializeUser(function(user, done) {
//     done(null, user);
//   });
  
//   passport.deserializeUser(function(obj, done) {
//     done(null, obj);
//   });
  
//   //Facebook strategry
//   passport.use(
//         new FacebookStrategy(
//             {
//                 clientID: process.env.FACEBOOK_CLIENT_ID,
//                 clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//                 callbackURL: process.env.FACEBOOK_CALLBACK_URL,
//                 profileFields: ['name', 'email', 'picture']
//             },
//             function(accessToken, refreshToken, profile, done) {
//                 console.log('accessToken', accessToken)
//                 console.log('refreshToken', refreshToken)
//                 console.log('profile', profile)
//                 console.log('profile.id', profile.id)

//                 User.findOne({ 
//                     where: { facebookId: profile.id }
//                 }).then(existingUser => {
//                     if (existingUser) { console.log('user already exists') }
//                     else {
//                         User.create({ name: profile.name.givenName, facebookId: profile.id })
//                     }
//                 })

//                 done(null, profile)
//             }
//         )
//   )


  
  // passport.use(new FacebookStrategy({
  //     clientID: process.env.FACEBOOK_CLIENT_ID,
  //     clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  //     callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  //     profileFields: ["email", "name"]
  //   },
  //   function(accessToken, refreshToken, profile, cb) {
  //     console.log(cb(err, user))
  //     // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
  //     //   return cb(err, user);
  //     // });
  //   }
  // ));


  // app.get('/logout', function(req, res){
//     req.logout();
//     res.redirect('/');
// });