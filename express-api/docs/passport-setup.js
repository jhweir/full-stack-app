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

// app.use(passport.initialize())
// const FacebookStrategy = require('passport-facebook').Strategy
// // Facebook strategry
// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   let user = User.findOne({ where: { id: id } })
//   done(null, true)
// })

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       callbackURL: process.env.FACEBOOK_CALLBACK_URL,
//       profileFields: ['id', 'name', 'email', 'picture']
//     },
//     function(accessToken, refreshToken, profile, done) {
//       console.log('accessToken', accessToken)
//       console.log('refreshToken', refreshToken)
//       console.log('profile', profile)
//       console.log('profile.id', profile.id)

//       User
//         .findOne({ where: { facebookId: profile.id } })
//         .then(foundUser => {
//           if (foundUser) { 
//             userId = foundUser.dataValues.id
//             console.log('foundUser: ', foundUser)
//           }
//           else {
//             User
//               .create({ 
//                 name: profile.name.givenName,
//                 flagImagePath: profile.photos[0].value,
//                 facebookId: profile.id
//               })
//               .then(createdUser => {
//                 console.log('createdUser: ', createdUser)
//                 userId = createdUser.dataValues.id
//               })
//           }
//       })//.then(console.log('user', user))
//       //user = {...profile}
//       done(null, profile)
//     }
//   )
// )

// app.get('/auth/facebook', passport.authenticate('facebook'))

// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('http://localhost:3000/h/all')
//   }
// )

// const passportJWT = require('passport-jwt')
// const JwtStrategy = passportJWT.Strategy
// const ExtractJwt = passportJWT.ExtractJwt
//const FacebookStrategy = require("passport-facebook").Strategy
// const LocalStrategy = require('passport-local').Strategy
// const flash = require('express-flash')
// const session = require('express-session')
// const Sequelize = require('sequelize')
// var SequelizeStore = require("connect-session-sequelize")(session.Store)


// const strategy = new JwtStrategy(options, (payload, next) => {
//   //const user = null
//   User.findOne({ where: { id: payload.id }}).then(user => next(null, user))
// })

// passport.use(strategy)
// app.use(passport.initialize())

// app.get('/api/user-data', passport.authenticate('local', { session: true }), (req, res) => {
//   //console.log('req.session.passport.user', req.session)
//   res.json(req.session)
//   // if (req.user) {
//   //   res.json(req.user.dataValues)
//   // } else {
//   //   res.send('failed')
//   // }

//   //console.log('req.session', req.session)
//   // User.findOne({ where: { id: userId } })
//   // .then(user => res.json(user))
// })

// // Log in
// app.post('/api/log-in',
//   passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/failure',
//     failureFlash: true
//   //})//(req, res, next)
// }))

// app.get('/api/check-auth', passport.authenticate('local', { session: true }), (req, res) => {
//   if (req.isAuthenticated()) {
//     res.send('true')
//   } else { res.send('false') }
// })

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   let user = User.findOne({ where: { id: id } })
//   done(null, true)
// })

// app.use(flash())
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   store: store,
//   cookie: { 
//     name: 'test',
//     path: '/',
//     httpOnly: false,
//     secure: false,
//     maxAge: 1000 * 60 * 30
//   }
// }))
// app.use(passport.initialize())
// app.use(passport.session())

// // Local strategy
// passport.use(
//   new LocalStrategy(
//     { usernameField: 'email', passwordField: 'password' },
//     (email, password, done) => {
//       console.log(email)
//       User.findOne({ where: { email: email } }).then(user => {
//         //console.log(user)
//         if (!user) { return done(null, false, { message: 'User not found' }) }
//         bcrypt.compare(password, user.password, function(error, success) {
//           //if (error) { /* handle error */ }
//           if (success) { return done(null, user) }
//           else { return done(null, false, { message: 'Incorrect password' }) }
//         })
//       }).catch(err => { done(err) })
//     }
//   )
// )
